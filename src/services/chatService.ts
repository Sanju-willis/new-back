// src\services\chatService.ts
import { openai } from '../config/openai';
import { agentRouter } from '../ai/agentRouter';
import { assistantReplyParams, AssistantReply } from '../interfaces/assistReply';
import { StageKey, StepKey } from '../interfaces/agentRouter';
import { getChatHistory, saveChatHistory } from '../utils/chatHistory';

const nextStepMap: Record<StepKey, StepKey | null> = { form_opened: 'company_name',  company_name: 'industry',  industry: 'role',
  role: null,
};

function injectSystemPrompt(history: any[]) {
  if (!history.find(m => m.role === 'system')) {
    history.unshift({
      role: 'system',
      content: 'You are a helpful onboarding assistant. Guide the user one step at a time. Only ask what is needed for the current step.',
    });
  }
  return history;
}

function isPromptLike(input: string): boolean {
  return input.includes('you are an AI') || input.includes('your goal:') || input.includes('Company created');
}

export async function assistantReply({ msg = '', stage, step, user }: assistantReplyParams): Promise<AssistantReply> {
  const resolvedStage = (stage ?? 'create_company') as StageKey;
  const resolvedStep = (step ?? 'form_opened') as StepKey;

  const promptBuilder = agentRouter?.[resolvedStage]?.[resolvedStep];
  const built = promptBuilder?.(user.name, resolvedStep, msg);
  const prompt = built?.prompt ?? `User (${user.name}) is interacting. Provide helpful guidance.`;
  const model = built?.model ?? 'gpt-3.5-turbo';

  let history = await getChatHistory(user._id);
  history = injectSystemPrompt(history);

  const cleanMsg = msg.trim();
  if (resolvedStep !== 'form_opened' && (!cleanMsg || isPromptLike(cleanMsg))) {
    return {
      reply: 'Please say something meaningful to continue.',
      stage: resolvedStage,
      step: resolvedStep,
    };
  }

  if (cleanMsg && !isPromptLike(cleanMsg)) {
    history.push({ role: 'user', content: cleanMsg });
  }

  if (!cleanMsg && resolvedStep === 'form_opened') {
    history.push({ role: 'user', content: prompt });
  }

  const aiReply = await openai.chat.completions.create({
    model,
    messages: history.slice(-15),
  });

  const reply = aiReply.choices[0].message.content ?? 'No response.';
  history.push({ role: 'assistant', content: reply });

  await saveChatHistory(user._id, history);

  const nextStep = cleanMsg ? nextStepMap[resolvedStep] ?? resolvedStep : resolvedStep;

  return {
    reply,
    stage: resolvedStage,
    step: nextStep,
  };
}

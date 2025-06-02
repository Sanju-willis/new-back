// src\services\chatService.ts
import { openai } from '../config/openai';
import { agentRouter } from '../ai/agentRouter';
import { assistantReplyParams, AssistantReply } from '../interfaces/assistReply';
import { StageKey, StepKey } from '../interfaces/agentRouter';
import { getChatHistory, saveChatHistory } from '../utils/chatHistory';

const nextStepMap: Record<StepKey, StepKey | null> = {
  form_opened: 'company_name',
  company_name: 'industry',
  industry: 'role',
  role: 'resume',
  resume: null,
};

const fallbackSteps: StepKey[] = ['form_opened', 'resume'];

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

export async function assistantReply({
  msg = '',
  stage,
  step,
  user,
}: assistantReplyParams): Promise<AssistantReply> {
  const resolvedStage = (stage ?? 'create_company') as StageKey;
  const resolvedStep = (step ?? 'form_opened') as StepKey;

  console.log('📩 Incoming request:', { msg, stage, step, user });

  const promptBuilder = agentRouter?.[resolvedStage]?.[resolvedStep];
  if (!promptBuilder) {
    console.warn(`⚠️ No prompt builder found for stage "${resolvedStage}", step "${resolvedStep}"`);
  }

  const built = promptBuilder?.({ name: user.name, companyId: user.companyId }, resolvedStep, msg);
  const prompt = built?.prompt ?? `User (${user.name}) is interacting. Provide helpful guidance.`;
  const model = built?.model ?? 'gpt-3.5-turbo';

  console.log('🧠 Using model:', model);
  console.log('💬 Prompt sent:', prompt);

  let history = await getChatHistory(user._id);
  history = injectSystemPrompt(history);

  const cleanMsg = msg.trim();

  // 🛑 Block empty/generic input unless step is in fallbackSteps
  if (!fallbackSteps.includes(resolvedStep) && (!cleanMsg || isPromptLike(cleanMsg))) {
    console.log('🚫 Ignored message: empty or generic');
    return {
      reply: 'Please say something meaningful to continue.',
      stage: resolvedStage,
      step: resolvedStep,
    };
  }

  if (cleanMsg && !isPromptLike(cleanMsg)) {
    history.push({ role: 'user', content: cleanMsg });
  }

  if (!cleanMsg && fallbackSteps.includes(resolvedStep)) {
    history.push({ role: 'user', content: prompt });
  }

  const aiReply = await openai.chat.completions.create({
    model,
    messages: history.slice(-15),
  });

  const reply = aiReply.choices[0].message.content ?? 'No response.';
  console.log('🤖 Assistant reply:', reply);

  history.push({ role: 'assistant', content: reply });
  await saveChatHistory(user._id, history);

  const nextStep = cleanMsg ? nextStepMap[resolvedStep] ?? resolvedStep : resolvedStep;

  return {
    reply,
    stage: resolvedStage,
    step: nextStep,
  };
}

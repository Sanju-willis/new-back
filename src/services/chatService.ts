// src\services\chatService.ts
import { openai } from '../config/openai';
import { stepPrompts } from '../ai/stepTemplates';
import { assistantReplyParams, AssistantReply, StageTypes, StepTypes } from '../interfaces/services/chatService';
import { getChatHistory, saveChatHistory } from '../utils/chatHistory';

const stageFlowMap: Record<StageTypes, StepTypes[]> = {
  create_company: ['form_opened', 'company_name', 'industry', 'role', 'resume'],
  company_created: ['form_opened', 'resume'],
};

function getNextStep(stage: StageTypes, currentStep: StepTypes): StepTypes {
  const steps = stageFlowMap[stage] || [];
  const index = steps.indexOf(currentStep);
  return index >= 0 && index < steps.length - 1 ? steps[index + 1] : currentStep;
}

function isFallbackStep(stage: StageTypes, step: StepTypes): boolean {
  return stageFlowMap[stage]?.[0] === step || step === 'resume';
}

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
  const resolvedStage = (stage ?? 'create_company') as StageTypes;
  const resolvedStep = (step ?? 'form_opened') as StepTypes;


  const template = stepPrompts?.[resolvedStage]?.[resolvedStep];
  const prompt = template?.prompt?.({ name: user.name, companyId: user.companyId }) ?? `User (${user.name}) is interacting. Provide helpful guidance.`;
  const model = template?.model ?? 'gpt-3.5-turbo';


  let history = await getChatHistory(user._id);
  history = injectSystemPrompt(history);

  const cleanMsg = msg.trim();

  if (!isFallbackStep(resolvedStage, resolvedStep) && (!cleanMsg || isPromptLike(cleanMsg))) {
    console.log('🚫 Ignored message: empty or generic');
    return {
    reply: `👋 Hey ${user.name}, where would you like to start today?`,
      stage: resolvedStage,
      step: resolvedStep,
    };
  }

  if (cleanMsg && !isPromptLike(cleanMsg)) {
    history.push({ role: 'user', content: cleanMsg });
  }

  if (!cleanMsg && isFallbackStep(resolvedStage, resolvedStep)) {
    history.push({ role: 'user', content: prompt });
  }

  const aiReply = await openai.chat.completions.create({
    model,
    messages: history.slice(-15),
  });

  const reply = aiReply.choices[0].message.content ?? 'No response.';

  history.push({ role: 'assistant', content: reply });
  await saveChatHistory(user._id, history);

  const nextStep = cleanMsg ? getNextStep(resolvedStage, resolvedStep) : resolvedStep;

  return {
    reply,
    stage: resolvedStage,
    step: nextStep,
  };
}

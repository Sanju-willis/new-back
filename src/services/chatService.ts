// src/services/chatService.ts

import { openai } from '../config/openai';
import { stepPrompts } from '../ai/stepTemplates';
import {
  assistantReplyParams,
  AssistantReply,
  StageTypes,
} from '../interfaces/services/chatService';
import { getChatHistory, saveChatHistory } from '../utils/chatHistory';

function injectSystemPrompt(history: any[]) {
  if (!history.find((m) => m.role === 'system')) {
    history.unshift({
      role: 'system',
      content: `
You are a helpful onboarding assistant. The user fills multiple fields at once.
Use the latest message (form context) to identify what has already been filled.
Only ask for fields that are missing. Do not repeat previously provided information.
Keep each reply under 20 words. Ask one clear question at a time.
      `.trim(),
    });
  }
  return history;
}

function isPromptLike(input: string): boolean {
  return (
    input.includes('you are an AI') ||
    input.includes('your goal:') ||
    input.includes('Company created')
  );
}

export async function assistantReply({
  msg = '',
  stage,
  user,
}: assistantReplyParams): Promise<AssistantReply> {
  const resolvedStage = (stage ?? 'create_company') as StageTypes;

  const template = stepPrompts?.[resolvedStage]?.form_opened;
  const prompt =
    template?.prompt?.({ name: user.name, companyId: user.companyId }) ??
    `User (${user.name}) is interacting. Guide them through onboarding.`;
  const model = template?.model ?? 'gpt-4o';

  let history = await getChatHistory(user._id);
  history = injectSystemPrompt(history);

  const cleanMsg = msg.trim();
  if (!cleanMsg || isPromptLike(cleanMsg)) {
    return {
      reply: `👋 Hey ${user.name}, ready to begin your company onboarding?`,
      stage: resolvedStage,
      step: 'form_opened',
    };
  }

  history.push({ role: 'user', content: cleanMsg });

  // Only inject prompt once if user history is short
  if (history.filter((m) => m.role === 'user').length === 1) {
    history.unshift({ role: 'user', content: prompt });
  }

  const aiReply = await openai.chat.completions.create({
    model,
    messages: history.slice(-15),
  });

  const reply = aiReply.choices[0].message.content ?? 'No response.';
  history.push({ role: 'assistant', content: reply });
  await saveChatHistory(user._id, history);

  return {
    reply,
    stage: resolvedStage,
    step: 'form_opened', // stays static now
  };
}

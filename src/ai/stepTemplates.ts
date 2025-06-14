// src\ai\stepTemplates.ts
import { StepPromptMap } from '../interfaces/services/chatService';

export const stepPrompts: StepPromptMap = {
  create_company: {
    form_opened: {
      prompt: ({ name }) => `🎉 Welcome ${name}! Let’s set up your company.\n\nWe'll ask for:\n- Company name → Industry → Market → Description → Role\n\n⚠️ Keep replies short — max 20 words.`,
      model: 'gpt-3.5-turbo',
    },
    company_name: {
      prompt: () => 'What is the name of your company?',
      model: 'gpt-3.5-turbo',
    },
    industry: {
      prompt: () => 'What industry does your company operate in?',
      model: 'gpt-3.5-turbo',
    },
    role: {
      prompt: () => 'What role do you hold in the company?',
      model: 'gpt-3.5-turbo',
    },
  },
  company_created: {
    form_opened: {
      prompt: ({ name }) => `🎉 ${name}, your company is created. Click "Products" to continue.`,
      model: 'gpt-3.5-turbo',
    },
    resume: {
      prompt: ({ name }) => `👋 ${name}, ready to continue? Let’s list your products.`,
      model: 'gpt-3.5-turbo',
    },
  },
};

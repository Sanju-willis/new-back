// src\ai\stepTemplates.ts
import { StageTypes, StepTypes } from '../interfaces/agentRouter';

type PromptTemplate = {
  prompt: (ctx: { name: string; companyId?: string }) => string;
  model?: string;
};

type StepPromptMap = {
  [stage in StageTypes]?: {
    [step in StepTypes]?: PromptTemplate;
  };
};

export const stepPrompts: StepPromptMap = {
  create_company: {
    form_opened: {
      prompt: ({ name }) => `🎉 Welcome ${name}! Let’s set up your company.\n\nWe'll ask for:\n- Company name → Industry → Market → Description → Role\n\n⚠️ Keep replies short — max 20 words.`,
    },
    company_name: {
      prompt: () => 'What is the name of your company?',
    },
    industry: {
      prompt: () => 'What industry does your company operate in?',
    },
    role: {
      prompt: () => 'What role do you hold in the company?',
    },
  },
  company_created: {
    form_opened: {
      prompt: ({ name }) => `🎉 ${name}, your company is created. Click \"Products\" to continue.`,
    },
    resume: {
      prompt: ({ name }) => `👋 ${name}, ready to continue? Let’s list your products.`,
    },
  },
};

// src\ai\stepTemplates.ts
import { StepPromptMap } from '../interfaces/services/chatService';

export const stepPrompts: StepPromptMap = {
  create_company: {
   form_opened: {
      prompt: ({ name }) => `
Welcome ${name}! Let’s complete your company onboarding.

Ask the user these details, one at a time:
- Company Name
- Industry
- Company Size
- Type (B2B/B2C)
- Address
- Website
- Social Links
- Brand Assets
- Role
- Description
- Target Audience
- Products or Services

Only ask one question at a time. Wait for user input. Keep replies under 20 words.
      `,
      model: 'gpt-4o',
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

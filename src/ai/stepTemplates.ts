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
      prompt: ({ name }) => `
Welcome back ${name}, your company profile is created.

Ask the user to:
- Add or review products/services
- Assign categories
- Describe offerings
- Upload visuals

Take it step by step. Only ask one thing at a time. Be clear and concise (under 20 words).
      `,
      model: 'gpt-4o',
    },
    resume: {
      prompt: ({ name }) => `
Hi ${name}, ready to continue product onboarding?

Ask the next product detail needed. Keep it brief and helpful.
      `,
      model: 'gpt-4o',
    },
  },
};

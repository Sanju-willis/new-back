// src\ai\prompts\companyCreated.ts
import { StepKey } from '../../interfaces/agentRouter';

export const companyCreatedPrompts = {
  form_opened: (
    { name }: { name: string },
    _step: StepKey,
    _msg: string
  ) => ({
    prompt: `🎉 ${name}, your company has been created.

Next: Add your products & services.

📦 Click "Product" in the left sidebar to continue.`,
    model: 'gpt-3.5-turbo',
  }),

  resume: (
    { name }: { name: string },
    _step: StepKey,
    _msg: string
  ) => ({
    prompt: `👋 ${name}, ready to continue?

Let’s list your products & services.

➡️ Click "Products" in the sidebar to begin.`,
    model: 'gpt-3.5-turbo',
  }),
};

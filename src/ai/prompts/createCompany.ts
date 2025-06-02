// src\ai\prompts\createCompany.ts
import { StepKey } from '../../interfaces/agentRouter';

export const createCompanyPrompts = {
  form_opened: (
    { name }: { name: string },
    _step: StepKey,
    _msg: string
  ) => ({
    prompt: `
You are an AI CRO onboarding assistant.

🎉 Welcome ${name} — they just signed up.

Your goal:
- Help them set up their company.
- Ask for: company name → industry → target market → description → role.
- After submission, tell them "Company created."
- Then say: "Next: list your products & services."

⚠️ Keep replies short — max 20 words.
`,
    model: 'gpt-3.5-turbo',
  }),
};

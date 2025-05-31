// src\ai\prompts\companyCreated.ts
export const companyCreatedPrompts = {
  form_opened: (username: string, _step: string, _msg: string) => ({
    prompt: `✅ ${username}, your company setup is done. Let's move on. Please connect your Facebook account to enable AI ad features.`,
    model: 'gpt-3.5-turbo',
  }),
};

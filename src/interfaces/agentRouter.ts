// src\interfaces\agentRouter.ts
export type StageKey = 'create_company' | 'company_created';
export type StepKey = 'form_opened' | 'company_name' | 'industry' | 'role';

export type PromptBuilder = (username: string, step: string, message: string) => {
  prompt: string;
  model: string;
};

export type AgentRouter = {
  [K in StageKey]: {
    [S in StepKey]?: PromptBuilder;
  };
};

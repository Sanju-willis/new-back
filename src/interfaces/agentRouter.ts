// src\interfaces\agentRouter.ts
export type StageKey = 'create_company' | 'company_created';
export type StepKey = 'form_opened' | 'company_name' | 'industry' | 'role' | 'resume';

export type PromptBuilder = (
  user: { name: string; companyId?: string },
  step: StepKey,
  message: string
) => {
  prompt: string;
  model: string;
};


export type AgentRouter = {
  [K in StageKey]: {
    [S in StepKey]?: PromptBuilder;
  };
};

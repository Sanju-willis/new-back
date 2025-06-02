// src\interfaces\agentRouter.ts
export type StageTypes = 'create_company' | 'company_created';
export type StepTypes = 'form_opened' | 'company_name' | 'industry' | 'role' | 'resume';

export type PromptBuilder = (
  user: { name: string; companyId?: string },
  step: StepTypes,
  message: string
) => {
  prompt: string;
  model: string;
};


export type AgentRouter = {
  [K in StageTypes]: {
    [S in StepTypes]?: PromptBuilder;
  };
};

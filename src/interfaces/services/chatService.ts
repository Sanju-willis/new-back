// src\interfaces\services\chatService.ts
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

export interface assistantReplyParams{
    msg?: string;
  stage?: string;
  step?: string;
  user: {
    _id: string;
    name: string;
    companyId?: string;
  };
}

export interface  AssistantReply {
  reply: string;
  stage: string;
  step: string;
}

export type PromptTemplate = {
  prompt: (ctx: { name: string; companyId?: string }) => string;
  model?: string;
};

export type StepPromptMap = {
  [stage in StageTypes]?: {
    [step in StepTypes]?: PromptTemplate;
  };
};

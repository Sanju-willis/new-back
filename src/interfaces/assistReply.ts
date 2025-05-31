// src\interfaces\assistReply.ts
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
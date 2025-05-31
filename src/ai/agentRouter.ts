// src\ai\agentRouter.ts

import { AgentRouter } from '../interfaces/agentRouter';
import { createCompanyPrompts } from './prompts/createCompany';
import { companyCreatedPrompts } from './prompts/companyCreated';

export const agentRouter: AgentRouter = {
  create_company: createCompanyPrompts,
  company_created: companyCreatedPrompts,
};

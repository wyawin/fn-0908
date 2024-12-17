import api from './api';
import { CreditApplication } from '../types/application';

export class ApplicationService {
  async create(workflowId: string, variables: Record<string, any>): Promise<CreditApplication> {
    const response = await api.post('/applications', { workflowId, variables });
    return response.data;
  }

  async findAll(): Promise<CreditApplication[]> {
    const response = await api.get('/applications');
    return response.data;
  }

  async findOne(id: string): Promise<CreditApplication> {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  }

  async process(id: string): Promise<CreditApplication> {
    const response = await api.put(`/applications/${id}/process`);
    return response.data;
  }
}

export const applicationService = new ApplicationService();
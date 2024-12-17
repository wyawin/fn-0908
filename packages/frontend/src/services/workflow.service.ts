import api from './api';
import { Workflow } from '../types/workflow';

export class WorkflowService {
  async create(workflow: Omit<Workflow, 'id'>): Promise<Workflow> {
    const response = await api.post('/workflows', workflow);
    return response.data;
  }

  async findAll(): Promise<Workflow[]> {
    const response = await api.get('/workflows');
    return response.data;
  }

  async findOne(id: string): Promise<Workflow> {
    const response = await api.get(`/workflows/${id}`);
    return response.data;
  }

  async update(id: string, workflow: Workflow): Promise<Workflow> {
    const response = await api.put(`/workflows/${id}`, workflow);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/workflows/${id}`);
  }
}

export const workflowService = new WorkflowService();
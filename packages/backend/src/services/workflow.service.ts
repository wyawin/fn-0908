import { AppDataSource } from '../config/database';
import { Workflow } from '../entities/Workflow';
import { WorkflowNode, Connection } from '../types/workflow';

export class WorkflowService {
  private workflowRepository = AppDataSource.getRepository(Workflow);

  async create(name: string, nodes: WorkflowNode[], connections: Connection[]): Promise<Workflow> {
    const workflow = this.workflowRepository.create({
      name,
      nodes,
      connections,
    });
    return this.workflowRepository.save(workflow);
  }

  async findAll(): Promise<Workflow[]> {
    return this.workflowRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Workflow | null> {
    return this.workflowRepository.findOne({
      where: { id, isActive: true },
    });
  }

  async update(id: string, name: string, nodes: WorkflowNode[], connections: Connection[]): Promise<Workflow | null> {
    const workflow = await this.workflowRepository.findOne({
      where: { id, isActive: true },
    });

    if (!workflow) return null;

    workflow.name = name;
    workflow.nodes = nodes;
    workflow.connections = connections;

    return this.workflowRepository.save(workflow);
  }

  async delete(id: string): Promise<boolean> {
    const workflow = await this.workflowRepository.findOne({
      where: { id, isActive: true },
    });

    if (!workflow) return false;

    workflow.isActive = false;
    await this.workflowRepository.save(workflow);
    return true;
  }
}
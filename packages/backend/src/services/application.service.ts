import { AppDataSource } from '../config/database';
import { CreditApplication } from '../entities/CreditApplication';
import { WorkflowService } from './workflow.service';
import { WorkflowExecutionService } from './workflowExecution.service';

export class ApplicationService {
  private applicationRepository = AppDataSource.getRepository(CreditApplication);
  private workflowService = new WorkflowService();
  private workflowExecutionService = new WorkflowExecutionService();

  async create(workflowId: string, variables: Record<string, any>): Promise<CreditApplication> {
    const workflow = await this.workflowService.findOne(workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    const application = this.applicationRepository.create({
      workflowId,
      variables,
      status: 'pending',
    });

    return this.applicationRepository.save(application);
  }

  async findAll(): Promise<CreditApplication[]> {
    return this.applicationRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<CreditApplication | null> {
    return this.applicationRepository.findOne({
      where: { id },
    });
  }

  async process(id: string): Promise<CreditApplication> {
    const application = await this.applicationRepository.findOne({
      where: { id },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    const workflow = await this.workflowService.findOne(application.workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    const result = await this.workflowExecutionService.execute(workflow, application.variables);
    
    application.status = result.status;
    application.creditScore = result.creditScore;
    application.comment = result.comment;

    return this.applicationRepository.save(application);
  }
}
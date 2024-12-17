import { Request, Response, NextFunction } from 'express';
import { WorkflowService } from '../services/workflow.service';

export class WorkflowController {
  constructor(private workflowService: WorkflowService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, nodes, connections } = req.body;
      const workflow = await this.workflowService.create(name, nodes, connections);
      res.status(201).json(workflow);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const workflows = await this.workflowService.findAll();
      res.json(workflows);
    } catch (error) {
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const workflow = await this.workflowService.findOne(req.params.id);
      if (!workflow) {
        return res.status(404).json({ message: 'Workflow not found' });
      }
      res.json(workflow);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, nodes, connections } = req.body;
      const workflow = await this.workflowService.update(req.params.id, name, nodes, connections);
      if (!workflow) {
        return res.status(404).json({ message: 'Workflow not found' });
      }
      res.json(workflow);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const success = await this.workflowService.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ message: 'Workflow not found' });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
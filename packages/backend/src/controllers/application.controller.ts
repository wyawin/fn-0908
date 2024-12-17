import { Request, Response, NextFunction } from 'express';
import { ApplicationService } from '../services/application.service';

export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { workflowId, variables } = req.body;
      const application = await this.applicationService.create(workflowId, variables);
      res.status(201).json(application);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const applications = await this.applicationService.findAll();
      res.json(applications);
    } catch (error) {
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const application = await this.applicationService.findOne(req.params.id);
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
      res.json(application);
    } catch (error) {
      next(error);
    }
  }

  async process(req: Request, res: Response, next: NextFunction) {
    try {
      const application = await this.applicationService.process(req.params.id);
      res.json(application);
    } catch (error) {
      next(error);
    }
  }
}
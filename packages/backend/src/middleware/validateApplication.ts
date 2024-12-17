import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const applicationSchema = z.object({
  workflowId: z.string().uuid(),
  variables: z.record(z.any()),
});

export const validateApplication = (req: Request, res: Response, next: NextFunction) => {
  try {
    applicationSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: 'Validation Error',
        errors: error.errors,
      });
    } else {
      next(error);
    }
  }
};
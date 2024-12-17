import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const nodeDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  config: z.record(z.any()),
  variables: z.array(z.any()).optional(),
});

const nodeSchema = z.object({
  id: z.string(),
  type: z.enum(['trigger', 'condition', 'action', 'credit-score', 'credit-score-check']),
  position: positionSchema,
  data: nodeDataSchema,
});

const connectionSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.enum(['default', 'true', 'false']),
});

const workflowSchema = z.object({
  name: z.string().min(1),
  nodes: z.array(nodeSchema),
  connections: z.array(connectionSchema),
});

export const validateWorkflow = (req: Request, res: Response, next: NextFunction) => {
  try {
    workflowSchema.parse(req.body);
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
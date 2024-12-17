import { Router } from 'express';
import { WorkflowController } from '../controllers/workflow.controller';
import { validateWorkflow } from '../middleware/validateWorkflow';
import { WorkflowService } from '../services/workflow.service';

const router = Router();
const workflowService = new WorkflowService();
const workflowController = new WorkflowController(workflowService);

router.post('/', validateWorkflow, (req, res, next) => workflowController.create(req, res, next));
router.get('/', (req, res, next) => workflowController.findAll(req, res, next));
router.get('/:id', (req, res, next) => workflowController.findOne(req, res, next));
router.put('/:id', validateWorkflow, (req, res, next) => workflowController.update(req, res, next));
router.delete('/:id', (req, res, next) => workflowController.delete(req, res, next));

export default router;
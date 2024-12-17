import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller';
import { validateApplication } from '../middleware/validateApplication';
import { ApplicationService } from '../services/application.service';

const router = Router();
const applicationService = new ApplicationService();
const applicationController = new ApplicationController(applicationService);

router.post('/', validateApplication, (req, res, next) => applicationController.create(req, res, next));
router.get('/', (req, res, next) => applicationController.findAll(req, res, next));
router.get('/:id', (req, res, next) => applicationController.findOne(req, res, next));
router.put('/:id/process', (req, res, next) => applicationController.process(req, res, next));

export default router;
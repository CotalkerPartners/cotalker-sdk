import express from 'express'

import { handler } from './handler'
import { handlerWrap } from './lib/handler-wrap'
import { ProjectController } from '@controller/project.controller';

const router = express.Router();
const projectController = new ProjectController();

router.all('/', handlerWrap(handler))
router.get('/projects', projectController.getAll);

export default router;

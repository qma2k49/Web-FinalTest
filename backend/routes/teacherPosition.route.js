import { Router } from 'express'
import teacherPositionController from '../controllers/teacherPosition.controller.js'

const teacherPositionRouter = Router();

teacherPositionRouter.get('/', teacherPositionController.getAllPositions);
teacherPositionRouter.post('/', teacherPositionController.createNewPosition);

export default teacherPositionRouter;

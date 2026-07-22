import { Router } from 'express'
import teacherController from '../controllers/teacher.controller.js'

const teacherRouter = Router();

teacherRouter.get('/', teacherController.getAllTeacher);
teacherRouter.post('/', teacherController.createNewTeacher);

export default teacherRouter;
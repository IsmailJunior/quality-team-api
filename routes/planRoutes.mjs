import { Router } from 'express';
import {
	getAllPlansController,
	createPlanController,
	updatePlanController,
	getPlanByIdController,
	deletePlanController,
} from '../controllers/planController.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router
	.route('/')
	.get(catchAsync(getAllPlansController))
	.post(catchAsync(createPlanController));
router
	.route('/:id')
	.get(catchAsync(getPlanByIdController))
	.patch(catchAsync(updatePlanController))
	.delete(catchAsync(deletePlanController));

export default router;

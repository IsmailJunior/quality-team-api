import { Router } from 'express';
import {
	createPlanController,
	getPlansController,
} from '../controllers/planController.mjs';
import { protectRoutetMiddleware } from '../middlewares/middlewares.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router.use(catchAsync(protectRoutetMiddleware));

router
	.route('/')
	.get(catchAsync(getPlansController))
	.post(catchAsync(createPlanController));

export default router;

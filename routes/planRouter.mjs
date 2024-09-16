import { Router } from 'express';
import {
	createPlanController,
	getPlansController,
} from '../controllers/planController.mjs';
import { protectRoutetMiddleware } from '../middlewares/auth.mjs';
import tierRouter from './tierRoutes.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router.use('/:planId/tiers', tierRouter);
router
	.route('/')
	.get(catchAsync(protectRoutetMiddleware), catchAsync(getPlansController))
	.post(catchAsync(protectRoutetMiddleware), catchAsync(createPlanController));

export default router;

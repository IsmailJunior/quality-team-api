import { Router } from 'express';
import {
	createPlanController,
	getPlansController,
} from '../controllers/planController.mjs';
import {
	setPlanIdToTiersMiddleware,
	protectRoutetMiddleware,
} from '../middlewares/middlewares.mjs';
import tierRouter from './tierRoutes.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router.use(catchAsync(protectRoutetMiddleware));

router.use('/:planId/tiers', setPlanIdToTiersMiddleware, tierRouter);
router
	.route('/')
	.get(catchAsync(getPlansController))
	.post(catchAsync(createPlanController));

export default router;

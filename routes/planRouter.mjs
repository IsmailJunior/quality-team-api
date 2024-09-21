import { Router } from 'express';
import {
	createPlanController,
	getPlansController,
} from '../controllers/planController.mjs';
import perkRouter from './perkRoutes.mjs';
import {
	protectRoutetMiddleware,
	setPlanIdToPerksMiddleware,
} from '../middlewares/middlewares.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router.use(catchAsync(protectRoutetMiddleware));
router.use('/:planId/perks', setPlanIdToPerksMiddleware, perkRouter);

router
	.route('/')
	.get(catchAsync(getPlansController))
	.post(catchAsync(createPlanController));

export default router;

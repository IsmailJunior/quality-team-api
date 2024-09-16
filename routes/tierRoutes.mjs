import { Router } from 'express';
import {
	createTierController,
	getTiersController,
} from '../controllers/tierController.mjs';
import { protectRoutetMiddleware } from '../middlewares/auth.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router({ mergeParams: true });

router
	.route('/')
	.get(catchAsync(protectRoutetMiddleware), catchAsync(getTiersController))
	.post(catchAsync(protectRoutetMiddleware), catchAsync(createTierController));

export default router;

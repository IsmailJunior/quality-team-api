import { Router } from 'express';
import {
	createTierController,
	getTiersController,
} from '../controllers/tierController.mjs';
import {
	protectRoutetMiddleware,
	uploadPhotoMiddleware,
} from '../middlewares/middlewares.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router({ mergeParams: true });

router.use(catchAsync(protectRoutetMiddleware));

router
	.route('/')
	.get(catchAsync(getTiersController))
	.post(uploadPhotoMiddleware, catchAsync(createTierController));

export default router;

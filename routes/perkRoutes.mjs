import { Router } from 'express';
import {
	createPerkController,
	getPerksController,
} from '../controllers/perkController.mjs';
import {
	protectRoutetMiddleware,
	uploadPhotoMiddleware,
} from '../middlewares/middlewares.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router({ mergeParams: true });

router.use(catchAsync(protectRoutetMiddleware));

router
	.route('/')
	.get(catchAsync(getPerksController))
	.post(uploadPhotoMiddleware, catchAsync(createPerkController));

export default router;

import { Router } from 'express';
import {
	createTierController,
	getTiersController,
} from '../controllers/tierController.mjs';
import {
	protectRoutetMiddleware,
	uploadPhotoMiddleware,
	setTierIdToContentMiddleware,
} from '../middlewares/middlewares.mjs';
import catchAsync from '../utils/catchAsync.mjs';
import contentRouter from './contentRoutes.mjs';

const router = Router({ mergeParams: true });

router.use(catchAsync(protectRoutetMiddleware));
router.use('/:tierId/contents', setTierIdToContentMiddleware, contentRouter);
router
	.route('/')
	.get(catchAsync(getTiersController))
	.post(uploadPhotoMiddleware, catchAsync(createTierController));

export default router;

import { Router } from 'express';
import {
	createContentController,
	getContentsController,
} from '../controllers/contentController.mjs';
import statsController from '../controllers/statsController.mjs';
import {
	protectRoutetMiddleware,
	uploadPhotoMiddleware,
	setSubscriptionIdToContentMiddleware,
} from '../middlewares/middlewares.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router({ mergeParams: true });

router.use(catchAsync(protectRoutetMiddleware));

router.route('/stats').get(catchAsync(statsController));

router
	.route('/')
	.get(catchAsync(getContentsController))
	.post(
		uploadPhotoMiddleware,
		setSubscriptionIdToContentMiddleware,
		catchAsync(createContentController),
	);

export default router;

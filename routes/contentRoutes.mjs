import { Router } from 'express';
import {
	createContentController,
	getContentsController,
	deleteContentController,
	getContentController,
	updateContentController,
} from '../controllers/contentController.mjs';
import statsController from '../controllers/statsController.mjs';
import {
	protectRoutetMiddleware,
	uploadPhotoMiddleware,
	uploadToCloudinaryMiddleware,
	setBundleIdToContentMiddleware,
	authenticateKeyMiddleware,
} from '../middlewares/middlewares.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router({ mergeParams: true });

// router.use(catchAsync(protectRoutetMiddleware));
// router.use(catchAsync(authenticateKeyMiddleware));

router.route('/stats').get(catchAsync(statsController));

router
	.route('/')
	.get(catchAsync(getContentsController))
	.post(
		uploadPhotoMiddleware,
		uploadToCloudinaryMiddleware,
		setBundleIdToContentMiddleware,
		catchAsync(createContentController),
	);

router
	.route('/:id')
	.get(catchAsync(getContentController))
	.patch(catchAsync(updateContentController))
	.delete(catchAsync(deleteContentController));

export default router;

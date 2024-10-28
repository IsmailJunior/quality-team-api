import { Router } from 'express';
import {
	createCommentController,
	findCommentsController,
} from '../controllers/commentController.mjs';
import {
	protectRoutetMiddleware,
	authenticateKeyMiddleware,
	uploadPhotoMiddleware,
	uploadToCloudinaryMiddleware,
	setContentIdToCommentMiddleware,
} from '../middlewares/middlewares.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router({ mergeParams: true });

router.use(protectRoutetMiddleware);
router.use(authenticateKeyMiddleware);

router
	.route('/')
	.get(catchAsync(findCommentsController))
	.post(
		uploadPhotoMiddleware,
		uploadToCloudinaryMiddleware,
		setContentIdToCommentMiddleware,
		catchAsync(createCommentController),
	);

export default router;

import { Router } from 'express';
import {
	createContentController,
	getContentsController,
} from '../controllers/contentController.mjs';
import {
	protectRoutetMiddleware,
	uploadPhotoMiddleware,
} from '../middlewares/middlewares.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router({ mergeParams: true });

router.use(catchAsync(protectRoutetMiddleware));


router
	.route('/')
	.get(catchAsync(getContentsController))
	.post(uploadPhotoMiddleware, catchAsync(createContentController));

export default router;

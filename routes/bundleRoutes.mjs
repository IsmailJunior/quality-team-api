import { Router } from 'express';
import {
	createBundleController,
	getBundleController,
	getBundlesController,
	updateBundleController,
	deleteBundleController,
} from '../controllers/bundleController.mjs';
import {
	protectRoutetMiddleware,
	setUserIdToBundleMiddleware,
	uploadPhotoMiddleware,
	authenticateKeyMiddleware,
} from '../middlewares/middlewares.mjs';
import contentRouter from './contentRoutes.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();
// router.use(catchAsync(authenticateKeyMiddleware));

// router.use(catchAsync(protectRoutetMiddleware));
router.use('/:bundleId/contents', contentRouter);

router
	.route('/')
	.get(catchAsync(getBundlesController))
	.post(
		uploadPhotoMiddleware,
		setUserIdToBundleMiddleware,
		catchAsync(createBundleController),
	);

router
	.route('/:id')
	.patch(catchAsync(updateBundleController))
	.get(catchAsync(getBundleController))
	.delete(catchAsync(deleteBundleController));

export default router;

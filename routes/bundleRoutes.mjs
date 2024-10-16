import { Router } from 'express';
import {
	createBundleController,
	getBundleController,
	getBundlesController,
	updateBundleController,
	deleteBundleController,
} from '../controllers/bundleController.mjs';
import statsController from '../controllers/statsController.mjs';
import {
	protectRoutetMiddleware,
	setUserIdToBundleMiddleware,
	uploadPhotoMiddleware,
	authenticateKeyMiddleware,
	getMeMiddleware,
	restrictRouteMiddleware,
} from '../middlewares/middlewares.mjs';
import contentRouter from './contentRoutes.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();
router.use(catchAsync(authenticateKeyMiddleware));

router.use(catchAsync(protectRoutetMiddleware));
router.use('/:bundleId/contents', contentRouter);
router.route('/stats').get(getMeMiddleware, catchAsync(statsController));

router.use(restrictRouteMiddleware('admin'));

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

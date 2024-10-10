import { Router } from 'express';
import {
	createSubscriptionController,
	getSubscriptionsController,
	getSubscriptionController,
	updateSubscriptionController,
	deleteSubscriptionController,
} from '../controllers/subscriptionController.mjs';
import {
	protectRoutetMiddleware,
	setUserIdToSubscriptionMiddleware,
	uploadPhotoMiddleware,
	authenticateKeyMiddleware,
} from '../middlewares/middlewares.mjs';
import contentRouter from './contentRoutes.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();
// router.use(catchAsync(authenticateKeyMiddleware));

// router.use(catchAsync(protectRoutetMiddleware));
router.use('/:subscriptionId/contents', contentRouter);

router
	.route('/')
	.get(catchAsync(getSubscriptionsController))
	.post(
		uploadPhotoMiddleware,
		setUserIdToSubscriptionMiddleware,
		catchAsync(createSubscriptionController),
	);

router
	.route('/:id')
	.patch(catchAsync(updateSubscriptionController))
	.get(catchAsync(getSubscriptionController))
	.delete(catchAsync(deleteSubscriptionController));

export default router;

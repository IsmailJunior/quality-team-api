import { Router } from 'express';
import {
	createSubscriptionController,
	getSubscriptionsController,
	getSubscriptionController,
} from '../controllers/subscriptionController.mjs';
import {
	protectRoutetMiddleware,
	setUserIdToSubscriptionMiddleware,
	uploadPhotoMiddleware,
} from '../middlewares/middlewares.mjs';
import contentRouter from './contentRoutes.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router.use(catchAsync(protectRoutetMiddleware));
router.use('/:subscriptionId/contents', contentRouter);

router
	.route('/')
	.get(catchAsync(getSubscriptionsController))
	.post(
		uploadPhotoMiddleware,
		setUserIdToSubscriptionMiddleware,
		catchAsync(createSubscriptionController),
	);

router.route('/:id').get(catchAsync(getSubscriptionController));

export default router;

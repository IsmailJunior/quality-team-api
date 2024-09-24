import { Router } from 'express';
import {
	createSubscriptionController,
	getSubscriptionController,
} from '../controllers/subscriptionController.mjs';
import {
	protectRoutetMiddleware,
	setUserIdToContractsMiddleware,
	setSubscriptionIdToTiersMiddleware,
	uploadPhotoMiddleware,
} from '../middlewares/middlewares.mjs';
import catchAsync from '../utils/catchAsync.mjs';
import tierRouter from './tierRoutes.mjs';

const router = Router();

router.use(catchAsync(protectRoutetMiddleware));
router.use(
	'/:subscriptionId/tiers',
	setSubscriptionIdToTiersMiddleware,
	tierRouter,
);

router
	.route('/')
	.get(catchAsync(getSubscriptionController))
	.post(
		uploadPhotoMiddleware,
		setUserIdToContractsMiddleware,
		catchAsync(createSubscriptionController),
	);

export default router;

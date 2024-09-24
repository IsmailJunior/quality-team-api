import { Router } from 'express';
import {
	createSubscriptionController,
	getSubscriptionController,
} from '../controllers/subscriptionController.mjs';
import {
	protectRoutetMiddleware,
	setUserIdToContractsMiddleware,
	setContractIdToTiersMiddleware,
	uploadPhotoMiddleware,
} from '../middlewares/middlewares.mjs';
import catchAsync from '../utils/catchAsync.mjs';
import tierRouter from './tierRoutes.mjs';

const router = Router();

router.use(catchAsync(protectRoutetMiddleware));
router.use('/:contractId/tiers', setContractIdToTiersMiddleware, tierRouter);

router
	.route('/')
	.get(catchAsync(getSubscriptionController))
	.post(
		uploadPhotoMiddleware,
		setUserIdToContractsMiddleware,
		catchAsync(createSubscriptionController),
	);

export default router;

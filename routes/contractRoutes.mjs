import { Router } from 'express';
import {
	createContractController,
	getContractsController,
} from '../controllers/contractController.mjs';
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
	.get(catchAsync(getContractsController))
	.post(
		uploadPhotoMiddleware,
		setUserIdToContractsMiddleware,
		catchAsync(createContractController),
	);

export default router;

import { Router } from 'express';
import {
	createContractController,
	getContractsController,
} from '../controllers/contractController.mjs';
import {
	protectRoutetMiddleware,
	setUserIdToContractsMiddleware,
} from '../middlewares/middlewares.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router.use(catchAsync(protectRoutetMiddleware));

router
	.route('/')
	.get(catchAsync(getContractsController))
	.post(setUserIdToContractsMiddleware, catchAsync(createContractController));

export default router;

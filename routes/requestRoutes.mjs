import { Router } from 'express';
import {
	createRequestController,
	getRequestsController,
} from '../controllers/requestController.mjs';
import { protectRoutetMiddleware } from '../middlewares/middlewares.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router.use(catchAsync(protectRoutetMiddleware));

router
	.route('/')
	.get(catchAsync(getRequestsController))
	.post(catchAsync(createRequestController));

export default router;

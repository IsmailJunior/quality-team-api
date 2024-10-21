import { Router } from 'express';
import {
	getRequestController,
	createRequestController,
	getRequestsController,
	updateRequestController,
} from '../controllers/requestController.mjs';
import {
	protectRoutetMiddleware,
	authenticateKeyMiddleware,
	restrictRouteMiddleware,
} from '../middlewares/middlewares.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router.use(catchAsync(authenticateKeyMiddleware));
router.use(catchAsync(protectRoutetMiddleware));
router.use(restrictRouteMiddleware('admin'));

router
	.route('/')
	.get(catchAsync(getRequestsController))
	.post(catchAsync(createRequestController));

router
	.route('/:id')
	.get(catchAsync(getRequestController))
	.patch(catchAsync(updateRequestController));

export default router;

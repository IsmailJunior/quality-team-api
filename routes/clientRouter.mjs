import { Router } from 'express';
import {
	getClientsController,
	getClientController,
	createClientController,
	updateClientController,
	getCurrentClient,
} from '../controllers/clientController.mjs';
import {
	protectRoutetMiddleware,
	restrictRouteMiddleware,
} from '../middlewares/auth.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router
	.route('/')
	.get(
		catchAsync(protectRoutetMiddleware),
		restrictRouteMiddleware('admin'),
		catchAsync(getClientsController),
	)
	.post(
		catchAsync(protectRoutetMiddleware),
		catchAsync(createClientController),
	);

router
	.route('/me')
	.get(catchAsync(protectRoutetMiddleware), catchAsync(getCurrentClient));

router
	.route('/:id')
	.get(
		catchAsync(protectRoutetMiddleware),
		restrictRouteMiddleware('admin'),
		catchAsync(getClientController),
	)
	.patch(
		catchAsync(protectRoutetMiddleware),
		restrictRouteMiddleware('admin'),
		catchAsync(updateClientController),
	);

export default router;

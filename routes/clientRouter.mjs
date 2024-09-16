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
	setUserIdToClientMiddleware,
} from '../middlewares/middlewares.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router.use(catchAsync(protectRoutetMiddleware));

router
	.route('/')
	.get(catchAsync(getClientsController))
	.post(setUserIdToClientMiddleware, catchAsync(createClientController));

router.route('/me').get(catchAsync(getCurrentClient));

router
	.route('/:id')
	.get(catchAsync(getClientController))
	.patch(catchAsync(updateClientController));

export default router;

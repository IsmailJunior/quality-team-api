import { Router } from 'express';
import {
	restrictRouteMiddleware,
	protectRoutetMiddleware,
	authenticateKeyMiddleware,
	setUserIdToControllerMiddleware,
	uploadPhotoMiddleware,
	uploadToCloudinaryMiddleware,
} from '../middlewares/middlewares.mjs';
import catchAsync from '../utils/catchAsync.mjs';
import {
	createClientController,
	deleteClientController,
	updateClientController,
	findClientController,
	findClientsController,
} from '../controllers/clientController.mjs';

const router = Router({ mergeParams: true });

router.use(protectRoutetMiddleware);
router.use(authenticateKeyMiddleware);

router
	.route('/')
	.get(restrictRouteMiddleware('admin'), catchAsync(findClientsController))
	.post(
		restrictRouteMiddleware('admin'),
		uploadPhotoMiddleware,
		uploadToCloudinaryMiddleware,
		setUserIdToControllerMiddleware,
		catchAsync(createClientController),
	);

router
	.route('/:id')
	.get(catchAsync(findClientController))
	.patch(restrictRouteMiddleware('admin'), catchAsync(updateClientController))
	.delete(restrictRouteMiddleware('admin'), catchAsync(deleteClientController));

export default router;

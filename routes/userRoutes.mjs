import { Router } from 'express';
import {
	getUserByIdController,
	getUsersController,
	deleteUserController,
	getMeController,
	updateMeController,
	deleteMeController,
} from '../controllers/userController.mjs';
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
		catchAsync(getUsersController),
	);
router
	.route('/me')
	.get(catchAsync(protectRoutetMiddleware), catchAsync(getMeController))
	.patch(catchAsync(protectRoutetMiddleware), catchAsync(updateMeController))
	.delete(catchAsync(protectRoutetMiddleware), catchAsync(deleteMeController));
router
	.route('/:id')
	.get(
		catchAsync(protectRoutetMiddleware),
		restrictRouteMiddleware('admin'),
		catchAsync(getUserByIdController),
	)
	.delete(
		catchAsync(protectRoutetMiddleware),
		restrictRouteMiddleware('admin'),
		catchAsync(deleteUserController),
	);

export default router;

import { Router } from 'express';
import {
	getUserByIdController,
	getUsersController,
	deleteUserController,
	updateMeController,
	deleteMeController,
} from '../controllers/userController.mjs';
import {
	protectRoutetMiddleware,
	restrictRouteMiddleware,
} from '../middlewares/auth.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router.route('/').get(catchAsync(getUsersController));
router
	.route('/me')
	.patch(catchAsync(protectRoutetMiddleware), catchAsync(updateMeController))
	.delete(catchAsync(protectRoutetMiddleware), catchAsync(deleteMeController));
router
	.route('/:id')
	.get(catchAsync(getUserByIdController))
	.delete(
		catchAsync(restrictRouteMiddleware('admin')),
		catchAsync(deleteUserController),
	);

export default router;

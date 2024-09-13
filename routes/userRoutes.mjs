import { Router } from 'express';
import {
	getUserByIdController,
	getUsersController,
	deleteUserController,
	updateMeController,
} from '../controllers/userController.mjs';
import {
	protectRoutetMiddleware,
	restrictRouteMiddleware,
} from '../middlewares/auth.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router.route('/').get(catchAsync(getUsersController));
router
	.route('/updateMe')
	.patch(catchAsync(protectRoutetMiddleware), catchAsync(updateMeController));
router
	.route('/:id')
	.get(catchAsync(getUserByIdController))
	.delete(
		catchAsync(restrictRouteMiddleware('admin')),
		catchAsync(deleteUserController),
	);

export default router;

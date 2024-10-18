import { Router } from 'express';
import {
	getUserByIdController,
	getUsersController,
	deleteUserController,
	getMeController,
	updateMeController,
	deleteMeController,
	confirmEmailController,
	verifyEmailController,
} from '../controllers/userController.mjs';
import {
	protectRoutetMiddleware,
	getMeMiddleware,
	uploadPhotoMiddleware,
	uploadToCloudinaryMiddleware,
	authenticateKeyMiddleware,
	restrictRouteMiddleware,
} from '../middlewares/middlewares.mjs';
import clientRouter from './clientRoutes.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router.route('/verify/:id/:token').get(catchAsync(verifyEmailController));

router.use(catchAsync(authenticateKeyMiddleware));

router.use(catchAsync(protectRoutetMiddleware));

router.route('/').get(catchAsync(getUsersController));
router
	.route('/me')
	.get(getMeMiddleware, catchAsync(getMeController))
	.patch(
		uploadPhotoMiddleware,
		uploadToCloudinaryMiddleware,
		catchAsync(updateMeController),
	)
	.delete(catchAsync(deleteMeController));

router
	.route('/verify')
	.post(getMeMiddleware, catchAsync(confirmEmailController));

router.use(restrictRouteMiddleware('admin'));
router.use('/:userId/clients', clientRouter);
router
	.route('/:id')
	.get(catchAsync(getUserByIdController))
	.delete(catchAsync(deleteUserController));

export default router;

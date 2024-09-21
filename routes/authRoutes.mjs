import { Router } from 'express';
import {
	signupController,
	loginController,
	forgotPasswordController,
	resetPasswordController,
	updatePasswordController,
} from '../controllers/authController.mjs';
import {
	protectRoutetMiddleware,
	uploadPhotoMiddleware,
} from '../middlewares/middlewares.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router
	.route('/signup')
	.post(uploadPhotoMiddleware, catchAsync(signupController));
router.route('/login').post(uploadPhotoMiddleware, catchAsync(loginController));
router.route('/forgotPassword').post(catchAsync(forgotPasswordController));
router
	.route('/resetPassword/:token')
	.patch(catchAsync(resetPasswordController));

router.use(catchAsync(protectRoutetMiddleware));
router
	.route('/updatePassword')
	.patch(uploadPhotoMiddleware, catchAsync(updatePasswordController));

export default router;

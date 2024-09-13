import { Router } from 'express';
import {
	signupController,
	loginController,
	forgotPasswordController,
	resetPasswordController,
	updatePasswordController,
} from '../controllers/authController.mjs';
import { protectRoutetMiddleware } from '../middlewares/auth.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router.route('/signup').post(catchAsync(signupController));
router.route('/login').post(catchAsync(loginController));
router.route('/forgotPassword').post(catchAsync(forgotPasswordController));
router
	.route('/updatePassword')
	.patch(
		catchAsync(protectRoutetMiddleware),
		catchAsync(updatePasswordController),
	);
router
	.route('/resetPassword/:token')
	.patch(catchAsync(resetPasswordController));

export default router;

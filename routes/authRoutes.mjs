import { Router } from 'express';
import {
	signupController,
	loginController,
	forgotPasswordController,
	resetPasswordController,
	updatePasswordController,
} from '../controllers/authController.mjs';
import { protectRoutetMiddleware } from '../middlewares/middlewares.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router.route('/signup').post(catchAsync(signupController));
router.route('/login').post(catchAsync(loginController));
router.route('/forgotPassword').post(catchAsync(forgotPasswordController));
router
	.route('/resetPassword/:token')
	.patch(catchAsync(resetPasswordController));

router.use(catchAsync(protectRoutetMiddleware));
router.route('/updatePassword').patch(catchAsync(updatePasswordController));

export default router;

import { Router } from 'express';
import {
	signupController,
	getAllUsersController,
	deleteUserController,
	loginController,
	forgotPassword,
	resetPassword
} from '../controllers/authController.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router.route('/signup').post(catchAsync(signupController));
router.route('/login').post(catchAsync(loginController));
router.route('/forgot-password').post(catchAsync(forgotPassword));
router.route('/reset-password/:token').patch(catchAsync(resetPassword));
router.route('/users').get(catchAsync(getAllUsersController));
router.route('/users/:id').delete(catchAsync(deleteUserController));

export default router;

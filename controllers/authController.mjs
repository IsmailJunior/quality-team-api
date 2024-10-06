import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { signupService, loginService } from '../services/authService.mjs';
import {
	findUserByUsernameService,
	findUserByPasswordTokenService,
	findUserWithPasswordByIdService,
} from '../services/userService.mjs';
import Email from '../utils/email.mjs';
import AppError from '../utils/appError.mjs';

const signToken = (id) =>
	jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);
	// eslint-disable-next-line no-param-reassign
	user.password = undefined;
	// eslint-disable-next-line no-param-reassign
	user.active = undefined;
	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user,
		},
	});
};

export const signupController = async (req, res, _next) => {
	const {
		firstName,
		lastName,
		username,
		password,
		passwordConfirm,
		passwordChangedAt,
	} = req.body;
	const { user } = await signupService({
		firstName,
		lastName,
		username,
		password,
		passwordConfirm,
		passwordChangedAt,
	});
	// const url = 0;
	// await new Email(user, url).send('Welcome');
	createSendToken(user, 201, res);
};

export const loginController = async (req, res, next) => {
	const { username, password } = req.body;
	if (!username || !password)
		return next(new AppError('Please provide email and passowrd!', 400));
	const { user } = await loginService({
		username,
	});
	if (!user || !(await user.correctPassword(password, user.password)))
		return next(new AppError('Incorrect email or password.', 401));
	createSendToken(user, 200, res);
};

export const forgotPasswordController = async (req, res, next) => {
	const { email } = req.body;
	const { user } = await findUserByUsernameService(email);
	if (!user)
		return next(new AppError('There is no user with email address.', 404));
	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });
	const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;
	const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forgot your password, Please ignore this email!`;
	try {
		await new Email(user, resetURL, message).sendResetPassword();
		res.status(204).json({
			status: 'success',
			message: 'Token sent to email!',
			data: null,
		});
	} catch (error) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });
		return next(
			new AppError('There was an error sending the email, Try again later!'),
			500,
		);
	}
};

export const resetPasswordController = async (req, res, next) => {
	const hashedTokrn = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');
	const { user } = await findUserByPasswordTokenService(hashedTokrn);
	if (!user) return next(new AppError('Token is invalid or has expired', 400));
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();
	createSendToken(user, 200, res);
};

export const updatePasswordController = async (req, res, next) => {
	const { user } = await findUserWithPasswordByIdService(req.user.id);
	if (!req.body.passwordCurrent)
		return next(new AppError('Please provide a valid password.', 400));
	if (!user) return next(new AppError('The user dose not exist', 404));
	if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
		return next(new AppError('Your current password is worng.', 401));
	}
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	await user.save();
	createSendToken(user, 200, res);
};

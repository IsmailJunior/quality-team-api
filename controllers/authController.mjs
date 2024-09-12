import { promisify } from 'util';
import crypto from 'crypto';
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from 'jsonwebtoken';
import {
	registerUserService,
	findUsersService,
	loginUserService,
	deleteUserService,
	findUserByIdService,
	findUserService,
	findUserByPasswordTokenService,
} from '../services/authService.mjs';
import sendEmail from '../utils/email.mjs';
import AppError from '../utils/appError.mjs';

const signToken = (id) =>
	jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

export const signupController = async (req, res, _next) => {
	const { name, username, password, passwordConfirm, passwordChangedAt, role } =
		req.body;
	const { user } = await registerUserService({
		name,
		username,
		password,
		passwordConfirm,
		passwordChangedAt,
		role,
	});
	const token = signToken(user._id);
	res.status(201).json({
		status: 'success',
		token,
		data: {
			user,
		},
	});
};

export const getAllUsersController = async (req, res, _next) => {
	const { users } = await findUsersService(req);
	res.status(200).json({
		status: 'success',
		data: {
			users,
		},
	});
};

export const deleteUserController = async (req, res, next) => {
	const { id } = req.params;
	const { user } = await deleteUserService(id);
	if (!user) return next(new AppError('The user dose not exist', 404));
	res.status(204).json({
		status: 'success',
		data: null,
	});
};

export const loginController = async (req, res, next) => {
	const { username, password } = req.body;
	if (!username || !password)
		return next(new AppError('Please provide email and passowrd!', 400));
	const { user } = await loginUserService({
		username,
		password,
	});
	if (!user || !(await user.correctPassword(password, user.password)))
		return next(new AppError('Incorrect email or password.', 401));

	const token = signToken(user._id);
	res.status(200).json({
		status: 'success',
		token,
	});
};

export const protect = async (req, _res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}
	if (!token)
		return next(
			new AppError('You are not logged in! Please login to get access.', 401),
		);
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	const { user: freshUser } = await findUserByIdService(decoded.id);
	if (!freshUser)
		return next(
			new AppError(
				'The user belonging to this token dose no longer exist.',
				401,
			),
		);
	if (freshUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError('User recently changed password! Please login again.', 401),
		);
	}
	req.user = freshUser;
	next();
};

export const restrict =
	(...roles) =>
	(req, _res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError('You do not have permission to perform this action.', 403),
			);
		}
		next();
	};

export const forgotPassword = async (req, res, next) => {
	const { email } = req.body;
	const { user } = await findUserService(email);
	if (!user)
		return next(new AppError('There is no user with email address.', 404));
	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });
	const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;
	const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forgot your password, Please ignore this email!`;
	try {
		await sendEmail({
			email: user.username,
			subject: 'Your password reset token (valid for 10 min)',
			message,
		});
		res.status(200).json({
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

export const resetPassword = async (req, res, next) => {
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
	const token = signToken(user._id);
	res.status(200).json({
		status: 'success',
		token,
	});
};

import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import {
	updateMeService,
	deleteMeService,
	deleteUserService,
	findUserByEmailTokenService,
} from '../services/userService.mjs';
import {
	findDocByIdController,
	findDocsController,
} from './controllerFactory.mjs';
import {
	findDocByIdService,
	findDocsService,
} from '../services/serviceFactory.mjs';
import User from '../models/user.mjs';
import filterObject from '../utils/filterObject.mjs';
import AppError from '../utils/appError.mjs';
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import Email from '../utils/email.mjs';

const signToken = (id) =>
	jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);
	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user,
		},
	});
};

export const getUsersController = findDocsController(findDocsService(User));

export const getUserByIdController = findDocByIdController(
	findDocByIdService(User),
);

export const deleteUserController = async (req, res, next) => {
	const { user } = await deleteUserService(req.params.id);
	if (!user) return next(new AppError('No user found with that ID.', 404));
	res.status(200).json({
		status: 'success',
		data: null,
	});
};

export const getMeController = findDocByIdController(findDocByIdService(User));
export const updateMeController = async (req, res, next) => {
	if (!req.body) {
		return next(new AppError('Please provide inputs!', 400));
	}
	if (req.body.password || req.body.passwordConfirm)
		return next(
			new AppError(
				'This route is not for password updates. Please use /updatePassword.',
				400,
			),
		);
	const filteredBody = filterObject(
		req.body,
		'firstName',
		'lastName',
		'username',
	);
	if (req.file) {
		filteredBody.photo = req.file.path;
		filteredBody.filename = req.file.filename;
	}
	const { user } = await updateMeService({
		id: req.user.id,
		body: filteredBody,
	});
	res.status(200).json({
		status: 'success',
		data: user,
	});
};

export const deleteMeController = async (req, res, _next) => {
	await deleteMeService(req.user.id);
	res.status(204).json({
		status: 'success',
		data: null,
	});
};

export const confirmEmailController = async (req, res, next) => {
	const { id } = req.params;
	const user = await User.findById(id);
	if (!user) return next(new AppError('There is no user with this id.', 404));
	const confirmationToken = user.createEmailVerifyToken();
	await user.save({ validateBeforeSave: false });
	const confirmationURL = `${req.protocol}://${req.get('host')}/api/v1/users/verify/${id}/${confirmationToken}`;
	try {
		await new Email(user, confirmationURL).send(
			'confirmEmail',
			'Confirm Email',
		);
		res.status(200).json({
			status: 'success',
			data: null,
		});
	} catch (error) {
		user.confirmationToken = undefined;
		user.confirmationTokenExires = undefined;
		await user.save({ validateBeforeSave: false });
		return next(
			new AppError('There was an error sending the email, Try again later!'),
			500,
		);
	}
};

export const verifyEmailController = async (req, res, next) => {
	const hashedToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');
	const { user } = await findUserByEmailTokenService(hashedToken);
	if (!user) return next(new AppError('Token is invalid or has expired', 400));
	user.confirmed = true;
	user.confirmationToken = undefined;
	user.confirmationTokenExires = undefined;
	await user.save({ validateBeforeSave: false });
	await new Email(user, null).send('welcome', 'Welcome aboard');
	createSendToken(user, 200, res);
};

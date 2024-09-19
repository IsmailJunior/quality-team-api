import { updateMeService, deleteMeService } from '../services/userService.mjs';
import {
	deleteDocController,
	findDocByIdController,
	findDocsController,
} from './controllerFactory.mjs';
import {
	deleteDocService,
	findDocByIdService,
	findDocsService,
} from '../services/serviceFactory.mjs';
import User from '../models/user.mjs';
import filterObject from '../utils/filterObject.mjs';
import AppError from '../utils/appError.mjs';

export const getUsersController = findDocsController(findDocsService(User));

export const getUserByIdController = findDocByIdController(
	findDocByIdService(User),
);

export const deleteUserController = deleteDocController(deleteDocService(User));

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
	if (req.file) filteredBody.photo = req.file.path;
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

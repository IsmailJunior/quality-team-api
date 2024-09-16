import {
	findUsersService,
	findUserByIdService,
	deleteUserService,
	updateMeService,
	deleteMeService,
} from '../services/userService.mjs';
import filterObject from '../utils/filterObject.mjs';
import AppError from '../utils/appError.mjs';

export const getUsersController = async (req, res, _next) => {
	const { users } = await findUsersService(req);
	res.status(200).json({
		status: 'success',
		data: {
			users,
		},
	});
};

export const getUserByIdController = async (req, res, next) => {
	const { id } = req.params;
	const { user } = await findUserByIdService(id);
	if (!user) return next(new AppError('The user dose not exist', 404));
	res.status(200).json({
		status: 'success',
		data: {
			user,
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

export const getMeController = async (req, res, _next) => {
	const { user } = await findUserByIdService(req.user.id);
	res.status(200).json({
		status: 'success',
		data: user,
	});
};

export const updateMeController = async (req, res, next) => {
	if (req.body.password || req.body.passwordConfirm)
		return next(
			new AppError(
				'This route is not for password updates. Please use /updatePassword.',
				400,
			),
		);
	const filteredBody = filterObject(req.body, 'name', 'username');
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

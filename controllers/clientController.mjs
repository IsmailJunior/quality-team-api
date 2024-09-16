import {
	findClientsService,
	findClientByIdService,
	createClientService,
	updateClientService,
	findClientByUserService,
} from '../services/clientService.mjs';
import { findUserByIdService } from '../services/userService.mjs';
import AppError from '../utils/appError.mjs';

export const getClientsController = async (req, res, _next) => {
	const { clients } = await findClientsService(req.params);
	res.status(200).json({
		status: 'success',
		results: clients.length,
		data: {
			clients,
		},
	});
};

export const getClientController = async (req, res, next) => {
	const { client } = await findClientByIdService(req.params.id);
	if (!client)
		return next(new AppError('The client with this ID dose not exist.', 404));
	res.status(200).json({
		status: 'success',
		data: client,
	});
};

export const createClientController = async (req, res, _next) => {
	const { name, description, mobileNumber } = req.body;
	const { client } = await createClientService({
		name,
		description,
		mobileNumber,
		user: req.user.id,
	});
	res.status(201).json({
		status: 'success',
		data: client,
	});
};

export const updateClientController = async (req, res, next) => {
	const { name, description, mobileNumber } = req.body;
	const { client } = await updateClientService(req.params.id, {
		name,
		description,
		mobileNumber,
	});
	if (!client)
		return next(new AppError('The client with this ID dose not exist.', 404));
	res.status(200).json({
		status: 'success',
		data: client,
	});
};

export const getCurrentClient = async (req, res, next) => {
	const { user } = await findUserByIdService(req.user.id);
	const { client } = await findClientByUserService(user);
	if (!client) return next(new AppError("You haven't create a client yet."));
	res.status(200).json({
		status: 'success',
		data: client,
	});
};

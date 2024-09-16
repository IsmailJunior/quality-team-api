import { findClientByUserService } from '../services/clientService.mjs';
import { findUserByIdService } from '../services/userService.mjs';
import {
	findDocByIdController,
	findDocsController,
	createDocController,
	updateDocController,
} from './controllerFactory.mjs';
import {
	findDocByIdService,
	findDocsService,
	createDocService,
	updateDocService,
} from '../services/serviceFactory.mjs';
import Client from '../models/client.mjs';
import AppError from '../utils/appError.mjs';

export const getClientsController = findDocsController(findDocsService(Client));

export const getClientController = findDocByIdController(
	findDocByIdService(Client),
);

export const createClientController = createDocController(
	createDocService(Client),
);
export const updateClientController = updateDocController(
	updateDocService(Client),
);

export const getCurrentClient = async (req, res, next) => {
	const { user } = await findUserByIdService(req.user.id);
	const { client } = await findClientByUserService(user);
	if (!client) return next(new AppError("You haven't create a client yet."));
	res.status(200).json({
		status: 'success',
		data: client,
	});
};

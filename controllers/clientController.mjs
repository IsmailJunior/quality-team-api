import {
	findDocByIdController,
	findDocsController,
	updateDocController,
	deleteDocController,
} from './controllerFactory.mjs';
import {
	deleteDocService,
	updateDocService,
	findDocByIdService,
	findDocsService,
} from '../services/serviceFactory.mjs';
import createClientService from '../services/clientService.mjs';
import Client from '../models/client.mjs';
import AppError from '../utils/appError.mjs';

export const createClientController = async (req, res, next) => {
	const { body } = req;
	if (req.file) {
		body.photo = req.file.path;
		body.filename = req.file.filename;
	}
	if (!req.file) return next(new AppError('You have to upload a photo', 400));
	const { client } = await createClientService(body);
	res.status(201).json({
		status: 'success',
		data: client,
	});
};

export const findClientsController = findDocsController(
	findDocsService(Client),
);

export const findClientController = findDocByIdController(
	findDocByIdService(Client),
);

export const deleteClientController = deleteDocController(
	deleteDocService(Client),
);

export const updateClientController = updateDocController(
	updateDocService(Client),
);

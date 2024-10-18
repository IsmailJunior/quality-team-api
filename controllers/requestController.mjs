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
import Request from '../models/request.mjs';

export const createRequestController = createDocController(
	createDocService(Request),
);

export const getRequestController = findDocByIdController(
	findDocByIdService(Request),
);

export const getRequestsController = findDocsController(
	findDocsService(Request),
);

export const updateRequestController = updateDocController(
	updateDocService(Request),
);

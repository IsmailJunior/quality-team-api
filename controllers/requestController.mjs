import {
	findDocsController,
	createDocController,
} from './controllerFactory.mjs';
import {
	findDocsService,
	createDocService,
} from '../services/serviceFactory.mjs';
import Request from '../models/request.mjs';

export const createRequestController = createDocController(
	createDocService(Request),
);

export const getRequestsController = findDocsController(
	findDocsService(Request),
);

import {
	createDocController,
	findDocsController,
	findDocByIdController,
	updateDocController,
	deleteDocController,
} from './controllerFactory.mjs';
import {
	createDocService,
	findDocsService,
	findDocByIdService,
	updateDocService,
	deleteDocService,
} from '../services/serviceFactory.mjs';
import Bundle from '../models/bundle.mjs';

export const createBundleController = createDocController(
	createDocService(Bundle),
);

export const getBundlesController = findDocsController(findDocsService(Bundle));

export const getBundleController = findDocByIdController(
	findDocByIdService(Bundle),
);

export const updateBundleController = updateDocController(
	updateDocService(Bundle),
);

export const deleteBundleController = deleteDocController(
	deleteDocService(Bundle),
);

import {
	createDocController,
	findDocsController,
	findDocByIdController,
} from './controllerFactory.mjs';
import {
	createDocService,
	findDocsService,
	findDocByIdService,
} from '../services/serviceFactory.mjs';
import Content from '../models/content.mjs';

export const createContentController = createDocController(
	createDocService(Content),
);

export const getContentsController = findDocsController(
	findDocsService(Content),
);

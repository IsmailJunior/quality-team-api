import {
	createDocController,
	findDocsController,
} from './controllerFactory.mjs';
import {
	createDocService,
	findDocsService,
} from '../services/serviceFactory.mjs';
import Content from '../models/content.mjs';

export const createContentController = createDocController(
	createDocService(Content),
);

export const getContentsController = findDocsController(
	findDocsService(Content),
);


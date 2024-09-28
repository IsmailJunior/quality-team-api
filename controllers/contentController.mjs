import { findDocsController } from './controllerFactory.mjs';
import { findDocsService } from '../services/serviceFactory.mjs';
import createContentService from '../services/contentService.mjs';
import Content from '../models/content.mjs';

export const createContentController = async (req, res, _next) => {
	const { body } = req;
	const { content } = await createContentService(body);
	res.status(201).json({
		status: 'success',
		data: {
			content,
		},
	});
};

export const getContentsController = findDocsController(
	findDocsService(Content),
);

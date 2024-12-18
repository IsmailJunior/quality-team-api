import {
	createContentService,
	findContentsByTierService,
	findContentAndDelete,
} from '../services/contentService.mjs';
import {
	findDocByIdController,
	updateDocController,
} from './controllerFactory.mjs';
import {
	findDocByIdService,
	updateDocService,
} from '../services/serviceFactory.mjs';
import Content from '../models/content.mjs';
import AppError from '../utils/appError.mjs';

export const createContentController = async (req, res, next) => {
	const { body } = req;
	if (req.file) {
		body.photo = req.file.path;
		body.filename = req.file.filename;
	}
	const { content } = await createContentService(body);
	if (!content) return next(new AppError('Reached maximum content.', 400));
	res.status(201).json({
		status: 'success',
		data: {
			content,
		},
	});
};

export const getContentsController = async (req, res, _next) => {
	const { params: bundleId, query } = req;
	const { contents } = await findContentsByTierService(query, bundleId);
	res.status(200).json({
		status: 'success',
		results: contents.length,
		data: {
			contents,
		},
	});
};

export const deleteContentController = async (req, res, _next) => {
	await findContentAndDelete(req.params.id);
	res.status(204).json({
		status: 'success',
		data: null,
	});
};

export const getContentController = findDocByIdController(
	findDocByIdService(Content),
);

export const updateContentController = updateDocController(
	updateDocService(Content),
);

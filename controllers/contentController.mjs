import {
	createContentService,
	findContentsByTierService,
} from '../services/contentService.mjs';

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

export const getContentsController = async (req, res, _next) => {
	const { params: subscriptionId } = req;
	const { contents } = await findContentsByTierService(subscriptionId);
	res.status(200).json({
		status: 'success',
		results: contents.length,
		data: {
			contents,
		},
	});
};
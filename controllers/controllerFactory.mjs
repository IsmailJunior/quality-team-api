import AppError from '../utils/appError.mjs';

export const findDocByIdController = (service) => async (req, res, next) => {
	const {
		params: { id },
	} = req;
	const { doc } = await service(id);
	if (!doc) return next(new AppError('No doc found with that ID.', 404));
	res.status(200).json({
		status: 'success',
		data: {
			doc,
		},
	});
};

export const findDocsController = (service) => async (req, res, _next) => {
	const { query } = req;
	const { docs } = await service(query);
	res.status(200).json({
		status: 'success',
		results: docs.length,
		data: {
			docs,
		},
	});
};

export const deleteDocController = (service) => async (req, res, next) => {
	const {
		params: { id },
	} = req;
	const { doc } = await service(id);
	if (!doc) return next(new AppError('No docuemnt found with that ID.', 404));
	res.status(204).json({
		status: 'success',
		data: null,
	});
};

export const createDocController = (service) => async (req, res, _next) => {
	const { body } = req;
	const { doc } = await service(body);
	res.status(201).json({
		status: 'success',
		data: {
			doc,
		},
	});
};

export const updateDocController = (service) => async (req, res, next) => {
	const {
		params: { id },
		body,
	} = req;
	const { doc } = await service(id, body);
	if (!doc) return next(new AppError('No doc found with that ID.', 404));
	res.status(200).json({
		status: 'success',
		data: null,
	});
};

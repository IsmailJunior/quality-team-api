import { findDocsController } from './controllerFactory.mjs';
import { findDocsService } from '../services/serviceFactory.mjs';
import createEventService from '../services/eventService.mjs';
import Event from '../models/event.mjs';
import AppError from '../utils/appError.mjs';

export const createEventController = async (req, res, next) => {
	const { body } = req;
	if (req.file) {
		body.photo = req.file.path;
		body.filename = req.file.filename;
	}
	if (!body.photo) return next(new AppError('Please provide a cover.', 400));
	const { event } = await createEventService(body);
	res.status(201).json({
		status: 'success',
		data: {
			event,
		},
	});
};

export const getEventsController = findDocsController(findDocsService(Event));

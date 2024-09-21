import { findDocsController } from './controllerFactory.mjs';
import { findDocsService } from '../services/serviceFactory.mjs';
import createPerkService from '../services/perkService.mjs';
import AppError from '../utils/appError.mjs';
import Perk from '../models/perk.mjs';

export const createPerkController = async (req, res, next) => {
	if (!req.body) {
		return next(new AppError('Please provide inputs!', 400));
	}
	if (req.file) req.body.photo = req.file.path;
	if (!req.body.photo)
		return next(new AppError('Please provide a photo.', 400));
	const { perk } = await createPerkService(req.body);
	res.status(200).json({
		status: 'success',
		data: perk,
	});
};

export const getPerksController = findDocsController(findDocsService(Perk));

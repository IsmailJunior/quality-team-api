// eslint-disable-next-line import/no-extraneous-dependencies
import {
	createTourService,
	getAllToursService,
	getTourByIdService,
	updateTourService,
	deleteTourService,
	getTourStatsService,
	getMonthlyPlanService,
} from '../services/tourServices.mjs';
import AppError from '../utils/appError.mjs';

export const getTourByIdController = async (req, res, next) => {
	const { id } = req.params;
	const { tour } = await getTourByIdService(id);
	if (!tour) return next(new AppError('No tour found with that ID.', 404));
	res.status(200).json({
		status: 'success',
		data: {
			tour,
		},
	});
};

export const getAllToursController = async (req, res, _next) => {
	const { tours } = await getAllToursService(req);
	res.status(200).json({
		status: 'success',
		results: tours.length,
		data: {
			tours,
		},
	});
};

export const createTourController = async (req, res, _next) => {
	const { body } = req;
	const { tour } = await createTourService(body);
	res.status(201).json({
		status: 'success',
		data: {
			tour,
		},
	});
};

export const updateTourController = async (req, res, next) => {
	const { id } = req.params;
	const { tour } = await updateTourService(id, req.body);
	if (!tour) return next(new AppError('No tour found with that ID.', 404));
	res.status(204).json({
		status: 'success',
		data: null,
	});
};

export const deleteTourController = async (req, res, next) => {
	const { id } = req.params;
	const { tour } = await deleteTourService(id);
	if (!tour) return next(new AppError('No tour found with that ID.', 404));
	res.status(204).json({
		status: 'success',
		data: null,
	});
};

export const getTourStatsController = async (_req, res, _next) => {
	const { stats } = await getTourStatsService();
	res.status(200).json({
		status: 'success',
		data: {
			stats,
		},
	});
};

export const getMonthlyPlanController = async (req, res, _next) => {
	const { plan } = await getMonthlyPlanService(req);
	res.status(200).json({
		status: 'success',
		data: {
			plan,
		},
	});
};

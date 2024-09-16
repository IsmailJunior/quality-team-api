import {
	getTourStatsService,
	getMonthlyPlanService,
} from '../services/tourServices.mjs';
import Tour from '../models/tour.mjs';
import {
	findDocByIdService,
	findDocsService,
	deleteDocService,
	createDocService,
	updateDocService,
} from '../services/serviceFactory.mjs';
import {
	findDocByIdController,
	findDocsController,
	deleteDocController,
	createDocController,
	updateDocController,
} from './controllerFactory.mjs';

export const getTourByIdController = findDocByIdController(
	findDocByIdService(Tour),
);

export const getAllToursController = findDocsController(findDocsService(Tour));

export const createTourController = createDocController(createDocService(Tour));

export const updateTourController = updateDocController(updateDocService(Tour));

export const deleteTourController = deleteDocController(deleteDocService(Tour));

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

import {
	getAllPlansService,
	createPlanService,
	updatePlanService,
	getPlanByIdService,
	deletePlanService,
} from '../services/planService.mjs';
import AppError from '../utils/appError.mjs';

export const createPlanController = async (req, res, _next) => {
	const { body } = req;
	const { plan } = await createPlanService(body);
	res.status(201).json({
		status: 'success',
		data: {
			plan,
		},
	});
};

export const getAllPlansController = async (req, res, _next) => {
	const { plans } = await getAllPlansService(req);
	res.status(200).json({
		status: 'success',
		data: {
			plans,
		},
	});
};

export const updatePlanController = async (req, res, next) => {
	const { id } = req.params;
	const { plan } = await updatePlanService(id, req.body);
	if (!plan) return next(new AppError('No plan found with that ID.', 404));
	res.status(204).json({
		status: 'success',
		data: null,
	});
};

export const getPlanByIdController = async (req, res, next) => {
	const { id } = req.params;
	const { plan } = await getPlanByIdService(id);
	if (!plan) return next(new AppError('No plan found with that ID.', 404));
	res.status(200).json({
		status: 'success',
		data: {
			plan,
		},
	});
};

export const deletePlanController = async (req, res, next) => {
	const { id } = req.params;
	const { plan } = await deletePlanService(id);
	if (!plan) return next(new AppError('No plan found with that ID.', 404));
	res.status(204).json({
		status: 'success',
		data: null,
	});
};

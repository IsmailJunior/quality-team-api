import {
	createPlanService,
	findPlansService,
} from '../services/planService.mjs';

export const createPlanController = async (req, res, _next) => {
	const { tier, description, price, period, startDate, endDate } = req.body;
	const { plan } = await createPlanService({
		tier,
		description,
		price,
		period,
		startDate,
		endDate,
	});
	res.status(201).json({
		status: 'success',
		data: plan,
	});
};

export const getPlansController = async (req, res, _next) => {
	const { plans } = await findPlansService(req);
	res.status(200).json({
		status: 'success',
		results: plans.length,
		data: plans,
	});
};

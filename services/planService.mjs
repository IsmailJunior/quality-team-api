import Plan from '../models/plan.mjs';
import APIFeatures from '../utils/apiFeatures.mjs';

export const createPlanService = async (dto) => {
	const plan = await Plan.create(dto);
	return { plan };
};

export const findPlansService = async (dto) => {
	const features = new APIFeatures(Plan.find(), dto.query)
		.filter()
		.sort()
		.limit()
		.paginate();

	const plans = await features.query;
	return {
		plans,
	};
};

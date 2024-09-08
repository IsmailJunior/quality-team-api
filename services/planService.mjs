import Plan from '../models/plan.mjs';
import APIFeatures from '../utils/apiFeatures.mjs';

export const createPlanService = async (dto) => {
	const plan = await Plan.create(dto);
	return {
		plan,
	};
};
export const getPlanByIdService = async (id) => {
	const plan = await Plan.findById(id);
	return {
		plan,
	};
};

export const getAllPlansService = async (dto) => {
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

export const updatePlanService = async (id, dto) => {
	const plan = await Plan.findByIdAndUpdate(id, dto, {
		new: true,
		runValidators: true,
	});

	return {
		plan,
	};
};

export const deletePlanService = async (id) => {
	const plan = await Plan.findByIdAndDelete(id);
	return {
		plan,
	};
};

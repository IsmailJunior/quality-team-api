import Plan from '../models/plan.mjs';
import Hypermedia from '../models/hypermedia.mjs';
import APIFeatures from '../utils/apiFeatures.mjs';

export const createPlanService = async (dto) => {
	const hypermedia = await Hypermedia.create({
		url: dto.photo,
		filename: dto.filename,
	});
	const plan = await Plan.create({ ...dto, hypermedia });
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

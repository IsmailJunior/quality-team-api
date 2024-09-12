import Campaing from '../models/campaing.mjs';
import APIFeatures from '../utils/apiFeatures.mjs';

export const createCampaingService = async (dto) => {
	const campaing = await Campaing.create(dto);
	return { campaing };
};

export const findCampaingsService = async (dto) => {
	const features = new APIFeatures(Campaing.find(), dto.query)
		.filter()
		.sort()
		.limit()
		.paginate();

	const campaings = await features.query;
	return {
		campaings,
	};
};

export const findCampaingByIdService = async (id) => {
	const campaing = await Campaing.findById(id);
	return {
		campaing,
	};
};

import Tier from '../models/tier.mjs';
import APIFeatures from '../utils/apiFeatures.mjs';

export const createTierService = async (dto) => {
	const tier = await Tier.create(dto);
	return { tier };
};

export const findTiersService = async (contractId, query) => {
	const features = new APIFeatures(Tier.find({ contract: contractId }), query)
		.filter()
		.sort()
		.projection()
		.paginate();

	const tiers = await features.query;
	return {
		tiers,
	};
};

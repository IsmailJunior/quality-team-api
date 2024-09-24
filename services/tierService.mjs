import Tier from '../models/tier.mjs';
import APIFeatures from '../utils/apiFeatures.mjs';

export const createTierService = async (dto) => {
	const tier = await Tier.create(dto);
	return { tier };
};

export const findTiersService = async (subscriptionId, query) => {
	const features = new APIFeatures(
		Tier.find({ subscription: subscriptionId }),
		query,
	)
		.filter()
		.sort()
		.limit()
		.paginate();

	const tiers = await features.query;
	return {
		tiers,
	};
};

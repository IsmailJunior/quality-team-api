import { findTiersService } from '../services/tierService.mjs';
import { createDocService } from '../services/serviceFactory.mjs';
import { createDocController } from './controllerFactory.mjs';
import Tier from '../models/tier.mjs';

export const createTierController = createDocController(createDocService(Tier));

export const getTiersController = async (req, res, _next) => {
	const {
		query,
		params: { subscriptionId },
	} = req;
	const { tiers } = await findTiersService(subscriptionId, query);
	res.status(200).json({
		status: 'success',
		results: tiers.length,
		data: tiers,
	});
};

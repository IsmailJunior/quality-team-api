import {
	createTierService,
	findTiersService,
} from '../services/tierService.mjs';

export const createTierController = async (req, res, _next) => {
	if (!req.body.plan) req.body.plan = req.params.planId;
	const { name, description, plan } = req.body;
	const { tier } = await createTierService({
		name,
		description,
		plan,
	});
	res.status(201).json({
		status: 'success',
		data: tier,
	});
};

export const getTiersController = async (req, res, _next) => {
	const {
		query,
		params: { planId },
	} = req;
	const { tiers } = await findTiersService(planId, query);
	res.status(200).json({
		status: 'success',
		results: tiers.length,
		data: tiers,
	});
};

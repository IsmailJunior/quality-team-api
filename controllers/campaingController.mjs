import {
	findCampaingByIdService,
	findCampaingsService,
	createCampaingService,
} from '../services/campaingService.mjs';

export const createCampaingController = async (req, res, _next) => {
	const { body } = req;
	const { campaing } = await createCampaingService(body);
	res.status(201).json({
		status: 'success',
		data: {
			campaing,
		},
	});
};

export const getAllCampaingsController = async (req, res, _next) => {
	const { campaings } = await findCampaingsService(req);
	res.status(200).json({
		status: 'success',
		results: campaings.length,
		data: {
			campaings,
		},
	});
};

export const getCampaingByIdController = async (req, res, _next) => {
	const id = Number(req.params.id);
	const { campaing } = await findCampaingByIdService(id);
	res.status(200).json({
		status: 'success',
		data: {
			campaing,
		},
	});
};

import {
	getAllCampaingsService,
	getCampaingByIdService,
	createCampaingService,
} from '../services/campaingService.mjs';

export const createCampaingController = async (req, res) => {
	const { body } = req;
	const { campaing } = await createCampaingService(body);
	res.status(201).json({
		status: 'success',
		data: {
			campaing,
		},
	});
};

export const getAllCampaingsController = async (req, res) => {
	const { campaings } = await getAllCampaingsService(req);
	res.status(200).json({
		status: 'success',
		results: campaings.length,
		data: {
			campaings,
		},
	});
};

export const getCampaingByIdController = async (req, res) => {
	const id = Number(req.params.id);
	const { campaing } = await getCampaingByIdService(id);
	res.status(200).json({
		status: 'success',
		data: {
			campaing,
		},
	});
};

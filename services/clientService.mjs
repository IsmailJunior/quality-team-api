import Client from '../models/client.mjs';
import APIFeatures from '../utils/apiFeatures.mjs';

export const findClientsService = async (dto) => {
	const features = new APIFeatures(Client.find(), dto.query)
		.filter()
		.sort()
		.limit()
		.paginate();
	const clients = await features.query;
	return {
		clients,
	};
};

export const findClientByIdService = async (id) => {
	const client = await Client.findById(id);
	return {
		client,
	};
};

export const createClientService = async (dto) => {
	const client = await Client.create(dto);
	return {
		client,
	};
};

export const updateClientService = async (dto) => {
	const { id, body } = dto;
	const client = await Client.findByIdAndUpdate(id, body, {
		new: true,
		runValidators: true,
	});
	return {
		client,
	};
};

export const findClientByUserService = async (dto) => {
	const client = await Client.findOne({ user: dto });
	return { client };
};

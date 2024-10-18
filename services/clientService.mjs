import Client from '../models/client.mjs';
import Hypermedia from '../models/hypermedia.mjs';

const createClientService = async (dto) => {
	const hypermedia = await Hypermedia.create({
		url: dto.photo,
		filename: dto.filename,
	});
	const client = await Client.create({ ...dto, hypermedia });
	return { client };
};

export default createClientService;

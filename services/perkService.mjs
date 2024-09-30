import Perk from '../models/perk.mjs';
import Hypermedia from '../models/hypermedia.mjs';

const createPerkService = async (dto) => {
	const hypermedia = await Hypermedia.create({
		url: dto.photo,
		filename: dto.filename,
	});
	const perk = await Perk.create({ ...dto, hypermedia });
	return {
		perk,
	};
};

export default createPerkService;

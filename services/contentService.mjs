import { ObjectId } from 'bson';
import Content from '../models/content.mjs';
import Hypermedia from '../models/hypermedia.mjs';

export const createContentService = async (dto) => {
	let hypermedia;
	if (dto.photo && dto.filename) {
		hypermedia = await Hypermedia.create({
			url: dto.photo,
			filename: dto.filename,
		});
	} else {
		hypermedia = new ObjectId('66fb82cdf0d8c3c84ee7f44a');
	}
	const content = await Content.create({ ...dto, hypermedia });
	return { content };
};

export const findContentsByTierService = async (dto) => {
	const contents = await Content.find({ subscription: dto.subscriptionId });
	return {
		contents,
	};
};

export const findContentAndDelete = async (id) => {
	await Content.findByIdAndDelete(id);
};

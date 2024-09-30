import Content from '../models/content.mjs';
import Hypermedia from '../models/hypermedia.mjs';

export const createContentService = async (dto) => {
	const hypermedia = await Hypermedia.create({
		url: dto.photo,
		filename: dto.filename,
	});
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

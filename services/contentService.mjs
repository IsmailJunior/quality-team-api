import Content from '../models/content.mjs';
import Hypermedia from '../models/hypermedia.mjs';
import APIFeatures from '../utils/apiFeatures.mjs';

export const createContentService = async (dto) => {
	const hypermedia = await Hypermedia.create({
		url: dto.photo,
		filename: dto.filename,
	});
	const content = await Content.create({ ...dto, hypermedia });
	return { content };
};

export const findContentsByTierService = async (query, dto) => {
	const features = new APIFeatures(
		Content.find({ subscription: dto.subscriptionId }),
		query,
	)
		.filter()
		.sort()
		.limit()
		.paginate();
	const contents = await features.query;
	return {
		contents,
	};
};

export const findContentAndDelete = async (id) => {
	await Content.findByIdAndDelete(id);
};

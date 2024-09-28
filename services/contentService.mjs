import Content from '../models/content.mjs';
import Hypermedia from '../models/hypermedia.mjs';

const createContentService = async (dto) => {
	const hypermedia = await Hypermedia.create({ url: dto.photo });
	const content = await Content.create({ ...dto, hypermedia });
	return { content };
};

export default createContentService;

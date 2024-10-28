import Comment from '../models/comment.mjs';
import Hypermedia from '../models/hypermedia.mjs';
import Content from '../models/content.mjs';

const createCommentService = async (dto) => {
	const hypermedia = await Hypermedia.create({
		url: dto.photo,
		filename: dto.filename,
	});
	const comment = await Comment.create({
		...dto,
		hypermedia,
		content: dto.content,
	});
	return { comment };
};

export default createCommentService;

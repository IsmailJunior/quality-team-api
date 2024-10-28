import createCommentService from '../services/commentService.mjs';
import { findDocsController } from './controllerFactory.mjs';
import { findDocsService } from '../services/serviceFactory.mjs';
import Comment from '../models/comment.mjs';
import AppError from '../utils/appError.mjs';

export const createCommentController = async (req, res, next) => {
	const { body } = req;
	if (req.file) {
		body.photo = req.file.path;
		body.filename = req.file.filename;
	}
	if (!req.file) return next(new AppError('You have to upload a photo', 400));
	const { comment } = await createCommentService(body);
	res.status(201).json({
		status: 'success',
		data: comment,
	});
};

export const findCommentsController = findDocsController(
	findDocsService(Comment),
);

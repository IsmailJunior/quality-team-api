import { Schema, model } from 'mongoose';

const commentSchema = new Schema({
	text: String,
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

const Comment = model('Comment', commentSchema);

export default Comment;

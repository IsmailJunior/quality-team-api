import { Schema, model } from 'mongoose';

const commentSchema = new Schema({
	text: String,
});

const Comment = model('Comment', commentSchema);

export default Comment;

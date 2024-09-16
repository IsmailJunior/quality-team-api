import { Schema, model } from 'mongoose';

const commentSchema = new Schema({
	text: String,
	createdAt: {
		type: Date,
		default: Date.now,
	},
	hypermedia: {
		type: Schema.ObjectId,
		ref: 'Hypermedia',
	},
	content: {
		type: Schema.ObjectId,
		ref: 'Content',
	},
});

commentSchema.pre(/^find/, function (next) {
	this.select('-__v').populate({
		path: 'hypermedia',
		select: '-__v',
	});
	next();
});

const Comment = model('Comment', commentSchema);

export default Comment;

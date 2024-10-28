import { Schema, model } from 'mongoose';
import moment from 'moment';
import cloudinary from '../config/cloudinary.mjs';

const commentSchema = new Schema(
	{
		text: {
			type: String,
			minLength: [3, 'Comment must be more then 3 characters.'],
		},
		content: {
			type: Schema.ObjectId,
			ref: 'Content',
		},
		hypermedia: {
			type: Schema.ObjectId,
			ref: 'Hypermedia',
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

commentSchema.virtual('createdAtLocale').get(function () {
	moment.locale('ar-dz');
	return moment(this.createdAt).format('MMMM Do YYYY, h:mm a');
});
commentSchema.virtual('updatedAtLocale').get(function () {
	moment.locale('ar-dz');
	return moment(this.updatedAt).format('MMMM Do YYYY, h:mm a');
});

commentSchema.virtual('photo').get(function () {
	if (this.hypermedia && this.hypermedia.url) {
		return this.hypermedia.url.replace('/upload', '/upload/w_500,h_280');
	}
	return undefined;
});

commentSchema.pre(/^find/, function (next) {
	this.select('-__v').populate({
		path: 'hypermedia',
		select: '-__v',
	});
	next();
});

commentSchema.post('findOneAndDelete', async function (doc) {
	if (doc) {
		await cloudinary.uploader.destroy(doc.hypermedia.filename);
	}
});

const Comment = model('Comment', commentSchema);

export default Comment;

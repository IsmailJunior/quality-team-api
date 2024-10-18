import { Schema, model } from 'mongoose';

const clientSchema = new Schema(
	{
		name: String,
		hypermedia: {
			required: [true, 'A client must have a hypermedia.'],
			type: Schema.ObjectId,
			ref: 'Hypermedia',
		},
		theme: [String],
		intro: String,
		plan: String,
		description: String,
		socialMediaLinks: [String],
		user: {
			required: [true, 'A client must have a user.'],
			type: Schema.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

clientSchema.virtual('logo').get(function () {
	if (this.hypermedia && this.hypermedia.url) {
		return this.hypermedia.url.replace('/upload', '/upload/w_500,h_280');
	}
	return undefined;
});

clientSchema.pre(/^find/, function (next) {
	this.select('-__v')
		.populate({
			path: 'hypermedia',
			select: '-__v',
		})
		.populate({
			path: 'user',
			select: '-__v',
		});
	next();
});

const Client = model('Client', clientSchema);

export default Client;

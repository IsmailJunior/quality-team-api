import { Schema, model } from 'mongoose';
import { cloudinary } from '../config/cloudinary.mjs';

const eventSchema = new Schema(
	{
		title: String,
		description: String,
		size: {
			type: String,
			default: 'slim',
			enum: {
				values: ['slim', 'wide'],
				message: 'Size is either slim or wide.',
			},
			lowercase: true,
		},
		hypermedia: {
			required: [true, 'An event must have a hypermedia.'],
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

eventSchema.virtual('photo').get(function () {
	if (this.hypermedia && this.hypermedia.url) {
		return this.hypermedia.url;
	}
	return undefined;
} );

eventSchema.pre(/^find/, function (next) {
	this.select('-__v').populate({
		path: 'hypermedia',
		select: '-__v',
	});
	next();
});

eventSchema.post('findOneAndDelete', async function (doc) {
	if (doc) {
		await cloudinary.uploader.destroy(doc.hypermedia.filename);
	}
});

const Event = model('Event', eventSchema);

export default Event;

import { Schema, model } from 'mongoose';
import Content from './content.mjs';
import cloudinary from '../config/cloudinary.mjs';

const bundleSchema = new Schema(
	{
		cost: {
			type: Number,
			trim: true,
			required: [true, 'A bundle must have a cost.'],
		},
		user: {
			required: [true, 'A bundle must have a user.'],
			type: Schema.ObjectId,
			ref: 'User',
		},
		elements: {
			required: [true, 'A bundle must have an elements'],
			type: Number,
			default: 20,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

bundleSchema.post('findOneAndDelete', async function (doc) {
	if (doc) {
		const contents = await Content.find({ subscription: doc._id });
		await Promise.all(
			contents.map(
				async (element) =>
					await cloudinary.uploader.destroy(element.hypermedia.filename),
			),
		);
		await Content.deleteMany({ bundle: doc._id });
	}
} );

bundleSchema.pre(/^find/, function (next) {
	this.select('-__v').populate({
		path: 'contents',
		select: '-__v',
	});
	next();
});

bundleSchema.virtual('contents', {
	ref: 'Content',
	foreignField: 'bundle',
	localField: '_id',
});

const Bundle = model('Bundle', bundleSchema);

export default Bundle;

import { Schema, model } from 'mongoose';
// eslint-disable-next-line import/no-cycle
import Content from './content.mjs';
import Hypermedia from './hypermedia.mjs';
import cloudinary from '../config/cloudinary.mjs';

const bundleSchema = new Schema(
	{
		cost: {
			type: Number,
			trim: true,
			default: 100,
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

bundleSchema.virtual('overview').get(function () {
	if (this.elementsUsed === 0) return 0;
	return Math.round((100 * this.elementsUsed) / this.elements);
});

bundleSchema.virtual('elementsUsed').get(function () {
	if (this.contents) {
		return this.contents.length;
	}
	return 0;
});

bundleSchema.post('findOneAndDelete', async function (doc) {
	if (doc) {
		const contents = await Content.find({ bundle: doc._id });
		await Promise.all(
			contents.map(async (element) => {
				if (element.hypermedia.filename) {
					await cloudinary.uploader.destroy(element.hypermedia.filename);
				}
				await Hypermedia.findByIdAndDelete(element.hypermedia);
			}),
		);
		await Content.deleteMany({ bundle: doc._id });
	}
});

bundleSchema.virtual('contents', {
	ref: 'Content',
	foreignField: 'bundle',
	localField: '_id',
});

bundleSchema.pre(/^find/, function (next) {
	this.select('-__v').populate({
		path: 'contents',
		select: '-__v',
	});
	next();
});

const Bundle = model('Bundle', bundleSchema);

export default Bundle;

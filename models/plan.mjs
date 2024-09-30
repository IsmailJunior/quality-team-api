import { Schema, model } from 'mongoose';
import Perk from './perk.mjs';
const planSchema = new Schema(
	{
		tier: {
			type: String,
			default: 'basic',
			enum: {
				required: [true, 'A plan must have a tier'],
				values: ['basic', 'standard', 'premium'],
				message: 'Tier is either basic, standard, or premium.',
			},
			lowercase: true,
			unique: true,
		},
		description: String,
		hypermedia: {
			type: Schema.ObjectId,
			ref: 'Hypermedia',
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

planSchema.pre(/^find/, function (next) {
	this.select('-__v')
		.populate({
			path: 'perks',
			select: '-__v',
		})
		.populate({
			path: 'hypermedia',
			select: '-__v',
		});
	next();
});

planSchema.virtual('icon').get(function () {
	if (this.hypermedia && this.hypermedia.url) {
		return this.hypermedia.url.replace('/upload', '/upload/w_500,h_500,c_fit');
	}
	return undefined;
});

planSchema.virtual('perks', {
	ref: 'Perk',
	foreignField: 'plan',
	localField: '_id',
});

const Plan = model('Plan', planSchema);

export default Plan;

import { Schema, model } from 'mongoose';

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
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

planSchema.pre(/^find/, function (next) {
	this.select('-__v').populate({
		path: 'perks',
		select: '-__v',
	});
	next();
});
planSchema.virtual('perks', {
	ref: 'Perk',
	foreignField: 'plan',
	localField: '_id',
});

const Plan = model('Plan', planSchema);

export default Plan;

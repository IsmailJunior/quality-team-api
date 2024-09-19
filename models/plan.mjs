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
			unique: true,
		},
		description: String,
		price: {
			type: Number,
			required: [true, 'A plan must have a price.'],
		},
		period: {
			type: [Date],
			required: [true, 'A plan must have a period.'],
		},
		startDate: {
			type: Date,
			default: Date.now,
		},
		endDate: {
			type: Date,
			default: Date.now + 30,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

planSchema.virtual('tiers', {
	ref: 'Tier',
	foreignField: 'plan',
	localField: '_id',
});

planSchema.pre(/^find/, function (next) {
	this.select('-__v').populate('tiers');
	next();
});

const Plan = model('Plan', planSchema);

export default Plan;

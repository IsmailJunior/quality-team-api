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

const Plan = model('Plan', planSchema);

export default Plan;

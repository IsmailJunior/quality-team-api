import { Schema, model } from 'mongoose';

const planSchema = new Schema({
	type: {
		type: String,
		unique: true,
		required: [true, 'a Plan must have a type.'],
		enum: {
			values: ['basic', 'pro', 'enterprise'],
			message: 'Type is either basic, pro, or enterprise.',
		},
	},
	description: {
		type: String,
		maxLength: [
			120,
			'a Plan description must have less or equal then 120 characters.',
		],
		minLength: [
			15,
			'a Plan description must have more or equal then 15 characters.',
		],
	},
	cover: String,
	thumbnail: String,
	duration: {
		type: Number,
		default: 30,
	},
	price: {
		required: [true, 'a Plan must have a price.'],
		type: Number,
		min: [10, 'a Price must be above or equal then 10.'],
	},
	start_date: {
		type: Date,
		default: Date.now(),
	},
	expire_date: {
		type: Date,
		default: Date.now(),
	},
});

const Plan = model('Plan', planSchema);

export default Plan;

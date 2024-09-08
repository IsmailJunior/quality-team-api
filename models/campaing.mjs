import { Schema, model } from 'mongoose';

const campaingSchema = new Schema({
	description: {
		type: String,
		required: [true, 'A campaing must have a description.'],
	},
	type: {
		type: String,
		enum: {
			values: ['video', 'design', 'tvc', 'advertise'],
			message: 'Type is either design, tvc, or advertise.',
		},
	},
	quantity: {
		type: Number,
		required: [true, 'A quantity must have a quantity.'],
		max: [50, 'Quantity must be below or equal 50.'],
	},
	duration: {
		type: Number,
		required: [true, 'A duration must have a duration.'],
	},
});

const Campaing = model('Campaing', campaingSchema);

export default Campaing;

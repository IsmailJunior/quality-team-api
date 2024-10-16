import { Schema, model } from 'mongoose';

const requestSchema = new Schema(
	{
		user: {
			required: [true, 'A request must have a user.'],
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

const Request = model('Request', requestSchema);

export default Request;

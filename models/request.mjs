import { Schema, model } from 'mongoose';
import Bundle from './bundle.mjs';

const requestSchema = new Schema(
	{
		approve: {
			type: Boolean,
			default: null,
		},
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

requestSchema.post('findOneAndUpdate', async function (doc) {
	if (doc.approve === true) return await Bundle.create({ user: doc.user });
});

const Request = model('Request', requestSchema);

export default Request;

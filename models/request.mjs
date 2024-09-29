import { Schema, model } from 'mongoose';

const requestSchema = new Schema(
	{
		plan: {
			required: [true, 'A request must have a plan.'],
			type: Schema.ObjectId,
			ref: 'Plan',
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
requestSchema.pre(/^find/, function (next) {
	this.select('-__v').populate({
		path: 'plan',
		select: '-__v',
	});
	next();
});

const Request = model('Request', requestSchema);

export default Request;

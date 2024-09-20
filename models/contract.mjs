import { Schema, model } from 'mongoose';
import slugify from 'slugify';
import moment from 'moment';

const contractSchema = new Schema(
	{
		price: {
			type: Number,
			trim: true,
			required: [true, 'A contract must have a price.'],
		},
		startDate: {
			type: Date,
			default: Date.now,
		},
		endDate: {
			type: Date,
			default: () => Date.now() + 30 * 24 * 60 * 60 * 1000,
		},
		plan: {
			required: [true, 'A contract must have a plan.'],
			type: Schema.ObjectId,
			ref: 'Plan',
		},
		user: {
			required: [true, 'A contract must have a user.'],
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

contractSchema.virtual('expireDate').get(function () {
	moment.locale('ar-dz');
	return moment(this.endDate).fromNow();
});

contractSchema.pre(/^find/, function (next) {
	this.select('-__v')
		.populate({
			path: 'plan',
			select: '-__v',
		})
		.populate({
			path: 'user',
			select: '-__v',
		});
	next();
});

const Contract = model('Contract', contractSchema);

export default Contract;

import { Schema, model } from 'mongoose';
import moment from 'moment';
import Content from './content.mjs';
import { cloudinary } from '../config/cloudinary.mjs';

const subscriptionSchema = new Schema(
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

subscriptionSchema.post('findOneAndDelete', async function (doc) {
	if (doc) {
		const contents = await Content.find({ subscription: doc._id });
		await Promise.all(
			contents.map(
				async (element) =>
					await cloudinary.uploader.destroy(element.hypermedia.filename),
			),
		);
		await Content.deleteMany({ subscription: doc._id });
	}
});

subscriptionSchema.virtual('contents', {
	ref: 'Content',
	foreignField: 'subscription',
	localField: '_id',
});

subscriptionSchema.virtual('expireDate').get(function () {
	moment.locale('ar-dz');
	return moment(this.endDate).fromNow();
});

const Subscription = model('Subscription', subscriptionSchema);

export default Subscription;

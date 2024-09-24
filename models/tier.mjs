import { Schema, model } from 'mongoose';
import slugify from 'slugify';

const tierSchema = new Schema({
	slug: String,
	name: {
		type: String,
		required: [true, 'A tier must have a name.'],
	},
	description: String,
	subscription: {
		required: [true, 'A tier must belong to a subscription.'],
		type: Schema.ObjectId,
		ref: 'Subscription',
	},
});

tierSchema.pre(/^find/, function (next) {
	this.select('-__v').populate({ path: 'subscription', select: '-__v' });
	next();
});

tierSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

const Tier = model('Tier', tierSchema);

export default Tier;

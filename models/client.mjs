import { Schema, model } from 'mongoose';
import slugify from 'slugify';

const clientSchema = new Schema({
	slug: String,
	name: {
		type: String,
		required: [true, 'A client must have a name.'],
		maxLnegth: [15, 'Name must be less or equal 15 characters.'],
	},
	description: String,
	mobileNumber: String,
	plan: {
		type: Schema.ObjectId,
		ref: 'Plan',
	},
	user: {
		type: Schema.ObjectId,
		required: [true, 'A client must created under a certain user.'],
		ref: 'User',
	},
});

clientSchema.pre(/^find/, function (next) {
	this.select('-__v')
		.populate({
			path: 'plan',
			select: '-__v',
		})
		.populate({
			path: 'user',
			select: 'firstName lastName createdAt',
		});
	next();
});

clientSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

const Client = model('Client', clientSchema);

export default Client;

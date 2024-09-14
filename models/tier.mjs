import { Schema, model } from 'mongoose';
import slugify from 'slugify';

const tierSchema = new Schema({
	slug: String,
	name: {
		type: String,
		required: [true, 'A tier must have a name.'],
	},
	description: String,
});

tierSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

const Tier = model('Tier', tierSchema);

export default Tier;

import { Schema, model } from 'mongoose';
import slugify from 'slugify';

const clientSchema = new Schema({
	slug: String,
	name: {
		type: String,
		required: [true, 'A client must have a name.'],
		maxLnegth: [15, 'Name must be less or equal 15 characters.'],
	},
	picture: String,
	description: String,
	mobileNumber: String,
});

clientSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

const Client = model('Client', clientSchema);

export default Client;

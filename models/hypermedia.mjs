import { Schema, model } from 'mongoose';

const hypermediaSchema = new Schema({
	url: {
		type: String,
		trim: true,
	},
	filename: String,
});

hypermediaSchema.pre(/^find/, function (next) {
	this.select('-__v');
	next();
});

const Hypermedia = model('Hypermedia', hypermediaSchema);

export default Hypermedia;

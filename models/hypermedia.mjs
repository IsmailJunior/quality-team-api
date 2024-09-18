import { Schema, model } from 'mongoose';

const hypermediaSchema = new Schema({
	url: {
		required: [true, 'Url cannot be empty.'],
		type: String,
		trim: true,
	},
});

hypermediaSchema.pre(/^find/, function (next) {
	this.select('-__v');
	next();
});

const Hypermedia = model('Hypermedia', hypermediaSchema);

export default Hypermedia;

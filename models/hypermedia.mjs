import { Schema, model } from 'mongoose';

const hypermediaSchema = new Schema({
	cover: String,
	image: String,
	thumbnail: String,
	video: String,
});

hypermediaSchema.pre(/^find/, function (next) {
	this.select('-__v');
	next();
});

const Hypermedia = model('Hypermedia', hypermediaSchema);

export default Hypermedia;

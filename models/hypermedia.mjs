import { Schema, model } from 'mongoose';

const hypermediaSchema = new Schema({
	cover: String,
	image: String,
	thumbnail: String,
	video: String,
});

const Hypermedia = model('Hypermedia', hypermediaSchema);

export default Hypermedia;

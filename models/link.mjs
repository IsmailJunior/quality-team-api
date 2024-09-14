import { Schema, model } from 'mongoose';

const linkSchema = new Schema({
	href: String,
	rel: {
		type: String,
		enum: ['self', 'parent'],
	},
	method: {
		type: String,
		enum: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
	},
});

const Link = model('Link', linkSchema);

export default Link;

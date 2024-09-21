import { Schema, model } from 'mongoose';

const perkSchema = new Schema({
	title: {
		type: String,
		required: [true, 'A perk must have a name.'],
	},
	description: {
		type: String,
		required: [true, 'A perk must have a description.'],
	},
	plan: {
		required: [true, 'A perk must have a description.'],
		type: Schema.ObjectId,
		ref: 'Hypermedia',
	},
	hypermedia: {
		type: Schema.ObjectId,
		ref: 'Hypermedia',
	},
});

const Perk = model('Perk', perkSchema);

export default Perk;

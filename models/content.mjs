import { Schema, model } from 'mongoose';
import slugify from 'slugify';

const contentSchema = new Schema({
	slug: String,
	name: {
		type: String,
		required: 'A content must have a name.',
	},
	type: {
		type: String,
		required: [true, 'A type must have a type.'],
		enum: {
			values: [
				'graphic_design',
				'motion_graphic',
				'copy_writing',
				'tvc',
				'marketing',
			],
			message:
				'Type is either Graphic Design, Motion Graphic, Copy Writing, TVC, or Marketing.',
		},
	},
	description: String,
	details: String,
	status: {
		type: String,
		enum: {
			values: ['idle', 'approved', 'rejected'],
			message: 'Status is either Idle, Approved, or Rejected.',
		},
		default: 'idle',
	},
	image: String,
	created_at: {
		type: Date,
		default: Date.now(),
	},
});

contentSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

const Content = model('Content', contentSchema);

export default Content;

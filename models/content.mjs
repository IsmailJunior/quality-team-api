import { Schema, model } from 'mongoose';
import slugify from 'slugify';
import moment from 'moment';

const contentSchema = new Schema(
	{
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
		hypermedia: {
			type: Schema.ObjectId,
			ref: 'Hypermedia',
		},
		tier: {
			type: Schema.ObjectId,
			ref: 'Tier',
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

contentSchema.virtual('createdAtLocale').get(function () {
	moment.locale('ar-dz');
	return moment(this.createdAt).format('MMMM Do YYYY, h:mm a');
});
contentSchema.virtual('updatedAtLocale').get(function () {
	moment.locale('ar-dz');
	return moment(this.updatedAt).format('MMMM Do YYYY, h:mm a');
});

contentSchema.pre(/^find/, function (next) {
	this.select('-__v').populate({
		path: 'hypermedia',
		select: '-__v',
	});
	next();
});

contentSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

const Content = model('Content', contentSchema);

export default Content;

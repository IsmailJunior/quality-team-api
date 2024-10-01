import { Schema, model } from 'mongoose';
import slugify from 'slugify';
import moment from 'moment';
import { cloudinary } from '../config/cloudinary.mjs';

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
		subscription: {
			required: [true, 'A content must belong to a subscription.'],
			type: Schema.ObjectId,
			ref: 'Subscription',
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

contentSchema.virtual('photo').get(function () {
	if (this.hypermedia && this.hypermedia.url) {
		return this.hypermedia.url;
	}
	return undefined;
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

contentSchema.post('findOneAndDelete', async function (doc) {
	if (doc) {
		await cloudinary.uploader.destroy(doc.hypermedia.filename);
	}
});

const Content = model('Content', contentSchema);

export default Content;

import { Schema, model } from 'mongoose';
import slugify from 'slugify';
import moment from 'moment';
// eslint-disable-next-line import/no-cycle
import Bundle from './bundle.mjs';
import Comment from './comment.mjs';
import Hypermedia from './hypermedia.mjs';
import cloudinary from '../config/cloudinary.mjs';

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
					'website',
					'mobile_app',
					'marketing',
					'graphic_design',
					'motion_graphic',
					'videograph',
					'tvc',
					'printing',
					'voiceover',
					'copy_writing',
					'models',
				],
				message:
					'Type is either Graphic Design, Motion Graphic, Copy Writing, TVC, etc.',
			},
		},
		description: {
			type: String,
			minLength: [3, 'Description must be more then 3 characters.'],
			maxLength: [300, 'Description must be less or equal 300 characters.'],
		},
		link: String,
		status: {
			type: String,
			enum: {
				values: ['idle', 'approved', 'rejected'],
				message: 'Status is either Idle, Approved, or Rejected.',
			},
			default: 'idle',
		},
		hypermedia: {
			required: [true, 'A content must have a hypermedia.'],
			type: Schema.ObjectId,
			ref: 'Hypermedia',
		},
		bundle: {
			required: [true, 'A content must belong to a bundle.'],
			type: Schema.ObjectId,
			ref: 'Bundle',
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
		return this.hypermedia.url.replace('/upload', '/upload/w_500,h_280');
	}
	return undefined;
});

contentSchema.pre('find', function (next) {
	this.select('-__v')
		.populate({
			path: 'hypermedia',
			select: '-__v',
		})
		.populate({
			path: 'comments',
			select: '-__v',
		});
	next();
});

contentSchema.pre('findOne', function (next) {
	this.select('-__v')
		.populate({
			path: 'hypermedia',
			select: '-__v',
		})
		.populate({
			path: 'comments',
			select: '-__v',
		});
	next();
});

contentSchema.pre('findOneAndUpdate', function (next) {
	this.select('-__v')
		.populate({
			path: 'hypermedia',
			select: '-__v',
		})
		.populate({
			path: 'comments',
			select: '-__v',
		});
	next();
});
contentSchema.pre('save', async function (next) {
	this.slug = slugify(this.name, { lower: true });
	const bundle = await Bundle.findById(this.bundle);
	await Bundle.findByIdAndUpdate(this.bundle, {
		elementsUsed: bundle.elementsUsed + 1,
	});
	next();
});

contentSchema.post('findOneAndDelete', async function (doc) {
	if (doc) {
		const comments = await Comment.find({ content: doc._id });
		await Promise.all(
			comments.map(
				async (element) =>
					await cloudinary.uploader.destroy(element.hypermedia.filename),
			),
		);
		await Comment.deleteMany({ content: doc._id });
		if (doc.hypermedia.filename) {
			await cloudinary.uploader.destroy(doc.hypermedia.filename);
		}
		await Hypermedia.findByIdAndDelete(doc.hypermedia);
	}
});

contentSchema.virtual('comments', {
	ref: 'Comment',
	foreignField: 'content',
	localField: '_id',
});

contentSchema.static(
	'isBundleElementsReachedMaximum',
	async function (bundleId) {
		const bundle = await Bundle.findById(bundleId);
		if (bundle.elements === bundle.contents.length) return true;
	},
);

const Content = model('Content', contentSchema);

export default Content;

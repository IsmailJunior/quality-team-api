import { model, Schema } from 'mongoose';
import slugify from 'slugify';

const tourSchema = new Schema(
	{
		slug: String,
		name: {
			type: String,
			required: [true, 'A tour must have a name.'],
			unique: true,
			trim: true,
			maxLength: [
				15,
				'A tour name must have less or equal then 15 characters.',
			],
			minLength: [5, 'A tour name must have more or equal then 5 characters.'],
		},
		durations: {
			type: Number,
			required: [true, 'A tour must have a duration.'],
		},
		maxGroupSize: {
			type: Number,
			required: [true, 'A tour must have a group size.'],
		},
		difficulty: {
			type: String,
			required: [true, 'A tour must have a diffiuclty.'],
			enum: {
				values: ['easy', 'medium', 'difficult'],
				message: 'Difficulty is either easy, medium, or difficult.',
			},
		},
		ratingsAverage: {
			type: Number,
			default: 4.5,
			min: [1, 'Rating must be abuve 1.0.'],
			max: [5, 'Rating must be below 5.0'],
		},
		ratingsQuantity: {
			type: Number,
			default: 0,
		},
		price: {
			type: String,
			required: [true, 'A tour must have a price.'],
		},
		priceDiscount: {
			type: Number,
			validate: {
				validator: function (value) {
					return value < this.price;
				},
				message: 'Discount price ({VALUE}) should be below the regular price.',
			},
		},
		summary: {
			type: String,
			trim: true,
			required: [true, 'A tour must have a description.'],
		},
		description: {
			type: String,
			trim: true,
		},
		imageCover: {
			type: String,
			required: [true, 'A tour must have a cover image.'],
		},
		images: [String],
		createdAt: {
			type: Date,
			default: Date.now(),
			select: false,
		},
		startsDate: [Date],
		secretTour: {
			type: Boolean,
			default: false,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

tourSchema.virtual('durationsWeeks').get(function () {
	return Math.floor(this.durations / 7);
});

tourSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

tourSchema.pre(/^find/, function (next) {
	this.find({ secretTour: { $ne: true } });
	next();
});

tourSchema.pre('aggregate', function (next) {
	this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
	next();
});
const Tour = model('Tour', tourSchema);

export default Tour;

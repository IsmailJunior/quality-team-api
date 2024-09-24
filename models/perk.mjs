import { Schema, model } from 'mongoose';

const perkSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, 'A perk must have a name.'],
		},
		description: {
			type: String,
			required: [true, 'A perk must have a description.'],
		},
		hypermedia: {
			type: Schema.ObjectId,
			ref: 'Hypermedia',
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

perkSchema.virtual('icon').get(function () {
	if (this.hypermedia && this.hypermedia.url) {
		return this.hypermedia.url.replace('/upload', '/upload/w_500,h_500,c_fill');
	}
	return undefined;
});

perkSchema.pre(/^find/, function (next) {
	this.select('-__v').populate({
		path: 'hypermedia',
		select: '-__v',
	});
	next();
});

const Perk = model('Perk', perkSchema);

export default Perk;

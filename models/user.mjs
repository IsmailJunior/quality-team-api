import { Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import slugify from 'slugify';
import moment from 'moment';
import Bundle from './bundle.mjs';
import Hypermedia from './hypermedia.mjs';

const userSchema = new Schema(
	{
		slug: String,
		firstName: {
			type: String,
			required: [true, 'Why no first name, Ha?'],
			minLength: [3, 'Name must be more then 3 characters.'],
			maxLength: [50, 'Name must be less or equal 50 characters.'],
		},
		lastName: {
			type: String,
			required: [true, 'Why no last name, Ha?'],
			minLength: [3, 'Name must be more then 3 characters.'],
			maxLength: [50, 'Name must be less or equal 50 characters.'],
		},
		username: {
			type: String,
			required: [true, 'Why no username, Ha?'],
			trim: true,
			lowercase: true,
			unique: true,
			validate: [validator.isEmail, 'Please provide a valid username.'],
		},
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user',
		},
		hypermedia: {
			type: Schema.ObjectId,
			ref: 'Hypermedia',
		},
		active: {
			type: Boolean,
			default: true,
			select: false,
		},
		password: {
			type: String,
			required: [true, 'Why no password, Ha?'],
			minLength: 8,
			select: false,
		},
		passwordConfirm: {
			type: String,
			required: [true, 'Why not confirming your password, Ha?'],
			validate: {
				validator: function (element) {
					return element === this.password;
				},
				message: 'Comfirmed password must be the same as password.',
			},
		},
		passwordChangedAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

userSchema.virtual('profile').get(function () {
	if (this.hypermedia && this.hypermedia.url) {
		return this.hypermedia.url.replace(
			'/upload',
			'/upload/w_200,h_200,c_thumb,r_max/q_auto/f_auto',
		);
	}
	return undefined;
});

userSchema.virtual('bundles', {
	ref: 'Bundle',
	foreignField: 'user',
	localField: '_id',
});

userSchema.virtual('createdAtLocale').get(function () {
	moment.locale('ar-dz');
	return moment(this.createdAt).format('MMMM Do YYYY, h:mm a');
});
userSchema.virtual('updatedAtLocale').get(function () {
	moment.locale('ar-dz');
	return moment(this.updatedAt).format('MMMM Do YYYY, h:mm a');
});

userSchema.virtual('passwordChangedAtLocale').get(function () {
	moment.locale('ar-dz');
	return moment(this.passwordChangedAt).fromNow();
});

userSchema.virtual('memberSince').get(function () {
	moment.locale('ar-dz');
	return moment(this.createdAt).fromNow();
});

userSchema.post('findOneAndDelete', async function (doc) {
	if (doc) {
		await Bundle.findOneAndDelete({ user: doc._id });
	}
});

userSchema.pre('find', function (next) {
	this.select('-__v')
		.find({ active: { $ne: false } })
		.select('-__v')
		.populate({
			path: 'hypermedia',
			select: '-__v',
		})
		.populate({
			path: 'bundles',
			select: '-__v',
		});
	next();
});

userSchema.pre('findOne', function (next) {
	this.select('-__v')
		.find({ active: { $ne: false } })
		.select('-__v')
		.populate({
			path: 'hypermedia',
			select: '-__v',
		})
		.populate({
			path: 'bundles',
			select: '-__v',
		});
	next();
});

userSchema.pre('findOneAndUpdate', function (next) {
	this.select('-__v')
		.find({ active: { $ne: false } })
		.select('-__v')
		.populate({
			path: 'hypermedia',
			select: '-__v',
		})
		.populate({
			path: 'bundles',
			select: '-__v',
		});
	next();
});

userSchema.pre('save', function (next) {
	this.slug = slugify(`${this.firstName} ${this.lastName}`, { lower: true });
	next();
});

userSchema.pre('save', async function (next) {
	const hypermedia = await Hypermedia.create({
		url: `https://api.dicebear.com/9.x/fun-emoji/jpg?seed=${this.firstName}`,
	});
	this.hypermedia = hypermedia;
	next();
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password') || this.isNew) return next();
	this.passwordChangedAt = Date.now() - 1000;
	next();
});

userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword,
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10,
		);
		return JWTTimestamp < changedTimestamp;
	}

	return false;
};

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');
	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
	return resetToken;
};

const User = model('User', userSchema);

export default User;

import { Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import slugify from 'slugify';

const userSchema = new Schema({
	slug: String,
	fullName: {
		type: String,
		required: [true, 'A user must have a full name.'],
		minLength: [3, 'Name must be more then 3 characters.'],
		maxLength: [50, 'Name must be less or equal 50 characters.'],
	},
	username: {
		type: String,
		required: [true, 'A user must have a username.'],
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
	mobileNumber: String,
	active: {
		type: Boolean,
		default: true,
		select: false,
	},
	password: {
		type: String,
		required: [true, 'Please provide a password.'],
		minLength: 8,
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Please confirm your password.'],
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
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

userSchema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } });
	next();
});

userSchema.pre('save', function (next) {
	this.slug = slugify(this.fullName, { lower: true });
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

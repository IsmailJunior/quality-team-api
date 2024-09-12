// eslint-disable-next-line import/no-extraneous-dependencies
import User from '../models/user.mjs';
import APIFeatures from '../utils/apiFeatures.mjs';

export const registerUserService = async ({
	name,
	username,
	password,
	passwordConfirm,
	passwordChangedAt,
	role,
}) => {
	const user = await User.create({
		name,
		username,
		password,
		passwordConfirm,
		passwordChangedAt,
		role,
	});
	return {
		user,
	};
};

export const loginUserService = async ({ username }) => {
	const user = await User.findOne({ username }).select('+password');
	return {
		user,
	};
};

export const findUsersService = async (dto) => {
	const features = new APIFeatures(User.find(), dto.query)
		.filter()
		.sort()
		.limit()
		.paginate();
	const users = await features.query;
	return {
		users,
	};
};

export const deleteUserService = async (id) => {
	const user = await User.findByIdAndDelete(id);
	return {
		user,
	};
};

export const findUserByIdService = async (id) => {
	const user = await User.findById(id);
	return {
		user,
	};
};

export const findUserService = async (dto) => {
	const user = await User.findOne({ username: dto });
	return {
		user,
	};
};

export const findUserByPasswordTokenService = async (dto) => {
	const user = await User.findOne({
		passwordResetToken: dto,
		passwordResetExpires: { $gt: Date.now() },
	});
	return {
		user,
	};
};

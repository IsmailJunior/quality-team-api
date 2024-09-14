// eslint-disable-next-line import/no-extraneous-dependencies
import User from '../models/user.mjs';

export const signupService = async ({
	fullName,
	username,
	password,
	passwordConfirm,
	passwordChangedAt,
	role,
}) => {
	const user = await User.create({
		fullName,
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

export const loginService = async ({ username }) => {
	const user = await User.findOne({ username }).select('+password');
	return {
		user,
	};
};

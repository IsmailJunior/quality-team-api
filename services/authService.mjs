import User from '../models/user.mjs';

export const signupService = async (dto) => {
	const user = await User.create(dto);
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

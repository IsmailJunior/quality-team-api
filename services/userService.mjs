import User from '../models/user.mjs';
import Hypermedia from '../models/hypermedia.mjs';
import APIFeatures from '../utils/apiFeatures.mjs';

export const findUsersService = async (dto) => {
	const features = new APIFeatures(User.find(), dto.query)
		.filter()
		.sort()
		.projection()
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

export const findUserByUsernameService = async (dto) => {
	const user = await User.findByUsername(dto);
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

export const findUserWithPasswordByIdService = async (dto) => {
	const user = await User.findById(dto).select('+password');
	return {
		user,
	};
};

export const updateMeService = async (dto) => {
	const { id, body } = dto;
	let hypermedia;
	const currentUser = await User.findById(id);
	if (currentUser.hypermedia && body.photo) {
		hypermedia = await Hypermedia.findByIdAndUpdate(
			currentUser.hypermedia._id,
			{ url: body.photo },
		);
	} else if (body.photo) {
		hypermedia = await Hypermedia.create({ url: body.photo });
	}
	const user = await User.findByIdAndUpdate(
		id,
		{ ...body, hypermedia },
		{
			new: true,
			runValidators: true,
		},
	);
	return {
		user,
	};
};

export const deleteMeService = async (dto) => {
	await User.findByIdAndUpdate(dto, { active: false });
};

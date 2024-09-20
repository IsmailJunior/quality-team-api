import APIFeatures from '../utils/apiFeatures.mjs';

export const findDocByIdService = (Model) => async (id) => {
	const doc = await Model.findById(id);
	return {
		doc,
	};
};

export const findDocsService = (Model) => async (query) => {
	// Build Query
	const features = new APIFeatures(Model.find(), query)
		.filter()
		.sort()
		.projection()
		.paginate();
	// Execute Query
	const docs = await features.query;
	return {
		docs,
	};
};

export const deleteDocService = (Model) => async (id) => {
	const doc = await Model.findByIdAndDelete(id);
	return {
		doc,
	};
};

export const createDocService = (Model) => async (dto) => {
	const doc = await Model.create(dto);
	return {
		doc,
	};
};

export const updateDocService = (Model) => async (id, dto) => {
	const doc = await Model.findByIdAndUpdate(id, dto, {
		new: true,
		runValidators: true,
	});
	return {
		doc,
	};
};

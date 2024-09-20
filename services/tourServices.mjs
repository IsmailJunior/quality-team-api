import Tour from '../models/tour.mjs';
import APIFeatures from '../utils/apiFeatures.mjs';

export const getTourByIdService = async (id) => {
	const tour = await Tour.findById(id);
	return {
		tour,
	};
};

export const getAllToursService = async (dto) => {
	// Build Query
	const features = new APIFeatures(Tour.find(), dto.query)
		.filter()
		.sort()
		.limit()
		.paginate();
	// Execute Query
	const tours = await features.query;
	return {
		tours,
	};
};

export const createTourService = async (dto) => {
	const tour = await Tour.create(dto);
	return {
		tour,
	};
};

export const updateTourService = async (id, dto) => {
	const tour = await Tour.findByIdAndUpdate(id, dto, {
		new: true,
		runValidators: true,
	});
	return {
		tour,
	};
};

export const deleteTourService = async (id) => {
	const tour = await Tour.findByIdAndDelete(id);
	return {
		tour,
	};
};

export const getTourStatsService = async () => {
	const stats = await Tour.aggregate([
		{
			$match: { ratingsAverage: { $gte: 4.5 } },
		},
		{
			$group: {
				_id: { $toUpper: '$difficulty' },
				numTours: { $sum: 1 },
				numRatings: { $sum: '$ratingsQuantity' },
				avgRating: { $avg: '$ratingsAverage' },
				avgPrice: { $avg: '$durations' },
				minPrice: { $min: '$price' },
				maxPrice: { $max: '$price' },
			},
		},
		{
			$sort: { avgPrice: 1 },
		},
	]);

	return {
		stats,
	};
};

export const getMonthlyPlanService = async (dto) => {
	const year = Number(dto.params.year);
	const plan = await Tour.aggregate([
		{ $unwind: '$startDate' },
		{
			$match: {
				startDate: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`),
				},
			},
		},
		{
			$group: {
				_id: { $month: '$startDate' },
				numToStarts: { $sum: 1 },
				tours: { $push: '$name' },
			},
		},
		{
			$addFields: { month: '$_id' },
		},
		{
			$project: {
				_id: 0,
			},
		},
		{
			$sort: {
				numTourStarts: -1,
			},
		},
	]);
	return {
		plan,
	};
};

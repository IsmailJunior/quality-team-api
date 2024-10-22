import statsService from '../services/statsService.mjs';

const statsController = async (req, res, _next) => {
	const { total, approved, rejected, idle } = await statsService(req);
	res.status(200).json({
		status: 'success',
		data: {
			total,
			approved,
			rejected,
			idle,
		},
	});
};

export default statsController;

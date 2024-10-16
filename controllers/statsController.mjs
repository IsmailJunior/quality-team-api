import statsService from '../services/statsService.mjs';

const statsController = async (req, res, _next) => {
	const { totalContents } = await statsService(req);
	res.status(200).json({
		status: 'success',
		data: {
			totalContents,
		},
	});
};

export default statsController;

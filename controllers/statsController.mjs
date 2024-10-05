import statsService from '../services/statsService.mjs';

const statsController = async (req, res, _next) => {
	const { params: subscriptionId } = req;
	const {
		totalContent,
		idleContent,
		approvedContent,
		rejectedContent,
	} = await statsService(subscriptionId);
	res.status(200).json({
		status: 'success',
		data: {
			totalContent,
			idleContent,
			approvedContent,
			rejectedContent,
		},
	});
};

export default statsController;

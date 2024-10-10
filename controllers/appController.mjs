import createAppService from '../services/appService.mjs';

const createAppController = async (req, res, _next) => {
	const { appName } = req.body;
	const { app } = await createAppService(appName);
	res.status(200).json({
		status: 'success',
		data: {
			app,
		},
	});
};

export default createAppController;

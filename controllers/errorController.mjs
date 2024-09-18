const devError = (err, req, res) => {
	if (err.isOperational === true) {
		res.status(err.statusCode).json({
			status: err.status,
			error: { ...err, code: err.code },
			timestamp: new Date(),
			endpoint: req.path,
			message: err.message,
			stack: err.stack,
			payload: req.body,
		});
	} else {
		console.error('ERORR', err);
		res.status(500).json({
			status: 'error',
			message: 'Something went wrong!',
		});
	}
};

const globalErrorController = (err, req, res, _next) => {
	// eslint-disable-next-line no-param-reassign
	err.statusCode = err.statusCode || 500;
	// eslint-disable-next-line no-param-reassign
	err.status = err.status || 'Error';

	devError(err, req, res);
};

export default globalErrorController;

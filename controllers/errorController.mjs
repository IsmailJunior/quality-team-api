const globalErrorController = (err, req, res, _next) => {
	if (err.name === 'ValidationError') {
		// eslint-disable-next-line no-param-reassign
		err.statusCode = 422;
		// eslint-disable-next-line no-param-reassign
		err.status = 'ValidationError';
	} else if (err.code === 11000) {
		// eslint-disable-next-line no-param-reassign
		err.statusCode = 400;
		// eslint-disable-next-line no-param-reassign
		err.status = 'MongoServerError';
	}

	res.status(err.statusCode).json({
		status: err.status,
		errors: [err.errors],
		timestamp: new Date(),
		endpoint: req.path,
		message: err.message,
		stack: err.stack,
		payload: req.body,
	});
};

export default globalErrorController;

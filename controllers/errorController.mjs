const globalErrorController = (err, req, res, _next) => {
	const error = {
		...err,
	};
	if (err.name === 'ValidationError') {
		error.statusCode = 422;
		error.status = 'ValidationError';
	}

	res.status(error.statusCode).json({
		status: error.status,
		errors: [error.errors],
		timestamp: new Date(),
		endpoint: req.path,
		message: error.message,
		stack: error.stack,
		payload: req.body,
	});
};

export default globalErrorController;

const globalErrorController = (err, req, res, _next) => {
	// const error = {
	// 	...err,
	// };
	// if (err.name === 'ValidationError') {
	// 	error.statusCode = 422;
	// 	error.status = 'ValidationError';
	// }

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

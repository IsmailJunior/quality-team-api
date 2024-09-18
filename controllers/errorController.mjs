const globalErrorController = (err, req, res, _next) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: { ...err, code: err.code },
		timestamp: new Date(),
		endpoint: req.path,
		message: err.message,
		stack: err.stack,
		payload: req.body,
	});
};

export default globalErrorController;

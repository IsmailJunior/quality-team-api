import AppError from '../utils/appError.mjs';

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}.`;
	return new AppError(message, 400);
};

const handleDuplicateFieldsErrorDB = (err) => {
	const value = err.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/)[0];
	const message = `Duplicate Field value: ${value}, Please use another value!`;
	return new AppError(message, 400, 11000);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((element) => element.message);
	const message = `Invalid input data, ${errors.join(' ')}`;
	return new AppError(message, 400);
};

const handleJWTError = () =>
	new AppError('Invalid token, Please log in again!', 401);

const handleJWTExpireError = () =>
	new AppError('Your token has expired!, Please log in again.', 401);

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

const prodError = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
	});
};

const globalErrorController = (err, req, res, _next) => {
	// eslint-disable-next-line no-param-reassign
	err.statusCode = err.statusCode || 500;
	// eslint-disable-next-line no-param-reassign
	err.status = err.status || 'Error';

	if (process.env.NODE_ENV === 'development') {
		devError(err, req, res);
	}
	if (process.env.NODE_ENV === 'production') {
		let error = { ...err };
		if (error.name === 'CastError') error = handleCastErrorDB(error);
		if (error.code === 11000) error = handleDuplicateFieldsErrorDB(error);
		if (error.name === 'ValidationError')
			error = handleValidationErrorDB(error);
		if (error.name === 'JsonWebTokenError') error = handleJWTError();
		if (error.name === 'TokenExpiredError') error = handleJWTExpireError();
		prodError(error, res);
	}
};

export default globalErrorController;

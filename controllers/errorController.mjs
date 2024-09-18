// import AppError from '../utils/appError.mjs';

// const handleCastErrorDB = (err) => {
// 	const message = `Invalid ${err.path}: ${err.value}.`;
// 	return new AppError(message, 400);
// };

// const handleDuplicateFieldsErrorDB = (err) => {
// 	const value = err.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/)[0];
// 	const message = `Duplicate Field value: ${value}, Please use another value!`;
// 	return new AppError(message, 400);
// };

// const handleValidationErrorDB = (err) => {
// 	const errors = Object.values(err.errors).map((element) => element.message);
// 	const message = `Invalid input data, ${errors.join(' ')}`;
// 	return new AppError(message, 400);
// };

// const handleJWTError = () =>
// 	new AppError('Invalid token, Please log in again!', 401);

// const handleJWTExpireError = () =>
// 	new AppError('Your token has expired!, Please log in again.', 401);

const globalErrorController = (err, req, res, _next) => {
	console.log(err);
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

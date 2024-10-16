class AppError extends Error {
	constructor(message, statusCode, code) {
		super(message, code);
		this.statusCode = statusCode;
		this.isOperational = true;
		Error.captureStackTrace(this, this.constructor);
	}
}

export default AppError;

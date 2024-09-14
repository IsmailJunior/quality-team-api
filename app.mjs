import dotenv from 'dotenv';
import express from 'express';
import logger from 'morgan';
// eslint-disable-next-line import/no-extraneous-dependencies
import rateLimit from 'express-rate-limit';
// eslint-disable-next-line import/no-extraneous-dependencies
import helmet from 'helmet';
// eslint-disable-next-line import/no-extraneous-dependencies
import mongoSanitize from 'express-mongo-sanitize';
// eslint-disable-next-line import/no-extraneous-dependencies
import xss from 'xss-clean';
// eslint-disable-next-line import/no-extraneous-dependencies
import hpp from 'hpp';

import AppError from './utils/appError.mjs';
import globalErrorController from './controllers/errorController.mjs';

import toursRouter from './routes/tourRoutes.mjs';
import authRouter from './routes/authRoutes.mjs';
import usersRouter from './routes/userRoutes.mjs';

if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}
// Express Application
const app = express();

const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP, Please try again in an hour!',
});
app.use(helmet());
app.use(limiter);

// Middlewares
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

if (process.env.NODE_ENV !== 'production') {
	app.use(logger('dev'));
}

// Routes
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/auth', authRouter);

app.all('*', (req, _res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorController);

export default app;

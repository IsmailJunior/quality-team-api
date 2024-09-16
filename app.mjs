import dotenv from 'dotenv';
// eslint-disable-next-line node/no-unpublished-import
import logger from 'morgan';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

import AppError from './utils/appError.mjs';
import globalErrorController from './controllers/errorController.mjs';

import toursRouter from './routes/tourRoutes.mjs';
import authRouter from './routes/authRoutes.mjs';
import usersRouter from './routes/userRoutes.mjs';
import clientsRouter from './routes/clientRouter.mjs';
import plansRouter from './routes/planRouter.mjs';
import tiersRouter from './routes/tierRoutes.mjs';

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
app.use('/api/v1/clients', clientsRouter);
app.use('/api/v1/plans', plansRouter);
app.use('/api/v1/tiers', tiersRouter);

app.all('*', (req, _res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorController);

export default app;

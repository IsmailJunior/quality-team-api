import dotenv from 'dotenv';
import express from 'express';
import logger from 'morgan';

import AppError from './utils/appError.mjs';
import globalErrorController from './controllers/errorController.mjs';

import plansRouter from './routes/planRoutes.mjs';
import usersRouter from './routes/tourRoutes.mjs';
import campaingsRouter from './routes/campaingRoutes.mjs';

if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}
// Express Application
const app = express();

// Middlewares
app.use(express.json());
app.use(logger('dev'));

// Routes
app.use('/api/v1/tours', usersRouter);
app.use('/api/v1/plans', plansRouter);
app.use('/api/v1/campaings', campaingsRouter);

app.all('*', (req, _res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// eslint-disable-next-line no-unused-vars
app.use(globalErrorController);

export default app;

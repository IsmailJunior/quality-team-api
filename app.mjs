import dotenv from 'dotenv';
import express from 'express';
import logger from 'morgan';

import AppError from './utils/appError.mjs';
import globalErrorController from './controllers/errorController.mjs';

import plansRouter from './routes/planRoutes.mjs';
import toursRouter from './routes/tourRoutes.mjs';
import campaingsRouter from './routes/campaingRoutes.mjs';
import authRouter from './routes/authRoutes.mjs';

if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}
// Express Application
const app = express();

// Middlewares
app.use(express.json());
app.use(logger('dev'));

// Routes
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/plans', plansRouter);
app.use('/api/v1/campaings', campaingsRouter);
app.use('/api/v1/auth', authRouter);

app.all('*', (req, _res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorController);

export default app;

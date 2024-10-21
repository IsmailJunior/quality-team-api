import dotenv from 'dotenv';
// eslint-disable-next-line node/no-unpublished-import, import/no-extraneous-dependencies
import logger from 'morgan';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';
import compression from 'compression';

import AppError from './utils/appError.mjs';
import globalErrorController from './controllers/errorController.mjs';

import contentRouter from './routes/contentRoutes.mjs';
import authRouter from './routes/authRoutes.mjs';
import userRouter from './routes/userRoutes.mjs';
import bundleRouter from './routes/bundleRoutes.mjs';
import requestRouter from './routes/requestRoutes.mjs';
import appRouter from './routes/appRoutes.mjs';
import clientRouter from './routes/clientRoutes.mjs';

if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}

// Express Application
const app = express();

const limiter = rateLimit({
	max: 500,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP, Please try again in an hour!',
});
app.use(helmet());
app.use(limiter);

// Middlewares
app.set('view engine', 'ejs');
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(compression());
if (process.env.NODE_ENV !== 'production') {
	app.use(logger('dev'));
}

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/bundles', bundleRouter);
app.use('/api/v1/contents', contentRouter);
app.use('/api/v1/requests', requestRouter);
app.use('/api/v1/app', appRouter);
app.use('/api/v1/clients', clientRouter);

app.all('*', (req, _res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorController);

export default app;

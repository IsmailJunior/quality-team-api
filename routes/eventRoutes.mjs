import { Router } from 'express';
import {
	getEventsController,
	createEventController,
} from '../controllers/eventController.mjs';
import {
	protectRoutetMiddleware,
	restrictRouteMiddleware,
	uploadPhotoMiddleware,
} from '../middlewares/middlewares.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router
	.route('/')
	.post(uploadPhotoMiddleware, catchAsync(createEventController))
	.get(catchAsync(getEventsController));

export default router;

import { Router } from 'express';
import {
	getEventsController,
	createEventController,
	deleteEventController,
} from '../controllers/eventController.mjs';
import {
	protectRoutetMiddleware,
	restrictRouteMiddleware,
	uploadPhotoMiddleware,
	authenticateKeyMiddleware,
} from '../middlewares/middlewares.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();
// router.use(catchAsync(authenticateKeyMiddleware));

router
	.route('/')
	.post(uploadPhotoMiddleware, catchAsync(createEventController))
	.get(catchAsync(getEventsController));

router.route('/:id').delete(catchAsync(deleteEventController));

export default router;

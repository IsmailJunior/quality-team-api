import { Router } from 'express';
import {
	createTourController,
	getAllToursController,
	getTourByIdController,
	updateTourController,
	deleteTourController,
	getTourStatsController,
	getMonthlyPlanController,
} from '../controllers/tourController.mjs';
import { protect, restrict } from '../controllers/authController.mjs';
import aliasTopToursMiddleware from '../middlewares/aliasTopTours.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router
	.route('/tour-stats')
	.get(catchAsync(protect), catchAsync(getTourStatsController));
router
	.route('/monthly-plans/:year')
	.get(catchAsync(protect), catchAsync(getMonthlyPlanController));
router
	.route('/top-five-cheap')
	.get(
		catchAsync(protect),
		aliasTopToursMiddleware,
		catchAsync(getAllToursController),
	);
router
	.route('/')
	.get(catchAsync(protect), catchAsync(getAllToursController))
	.post(catchAsync(protect), catchAsync(createTourController));
router
	.route('/:id')
	.get(catchAsync(protect), catchAsync(getTourByIdController))
	.patch(
		catchAsync(protect),
		restrict('admin'),
		catchAsync(updateTourController),
	)
	.delete(
		catchAsync(protect),
		restrict('admin'),
		catchAsync(deleteTourController),
	);
export default router;

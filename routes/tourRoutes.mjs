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
import {
	protectRoutetMiddleware,
	restrictRouteMiddleware,
} from '../middlewares/auth.mjs';
import aliasTopToursMiddleware from '../middlewares/aliasTopTours.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router
	.route('/tour-stats')
	.get(catchAsync(protectRoutetMiddleware), catchAsync(getTourStatsController));
router
	.route('/monthly-plans/:year')
	.get(
		catchAsync(protectRoutetMiddleware),
		catchAsync(getMonthlyPlanController),
	);
router
	.route('/top-five-cheap')
	.get(
		catchAsync(protectRoutetMiddleware),
		aliasTopToursMiddleware,
		catchAsync(getAllToursController),
	);
router
	.route('/')
	.get(catchAsync(protectRoutetMiddleware), catchAsync(getAllToursController))
	.post(catchAsync(protectRoutetMiddleware), catchAsync(createTourController));
router
	.route('/:id')
	.get(catchAsync(protectRoutetMiddleware), catchAsync(getTourByIdController))
	.patch(
		catchAsync(protectRoutetMiddleware),
		restrictRouteMiddleware('admin'),
		catchAsync(updateTourController),
	)
	.delete(
		catchAsync(protectRoutetMiddleware),
		restrictRouteMiddleware('admin'),
		catchAsync(deleteTourController),
	);
export default router;

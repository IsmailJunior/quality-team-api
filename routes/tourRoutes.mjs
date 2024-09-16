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
	aliasTopToursMiddleware,
} from '../middlewares/middlewares.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router.use(catchAsync(protectRoutetMiddleware));

router.route('/tour-stats').get(catchAsync(getTourStatsController));
router.route('/monthly-plans/:year').get(catchAsync(getMonthlyPlanController));
router
	.route('/top-five-cheap')
	.get(aliasTopToursMiddleware, catchAsync(getAllToursController));
router
	.route('/')
	.get(catchAsync(getAllToursController))
	.post(catchAsync(createTourController));
router
	.route('/:id')
	.get(catchAsync(getTourByIdController))
	.patch(catchAsync(updateTourController))
	.delete(catchAsync(deleteTourController));
export default router;

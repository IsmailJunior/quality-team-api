import { Router } from 'express';
import {
	createPlanController,
	getPlansController,
	getPlanByIdController,
} from '../controllers/planController.mjs';
import {
	protectRoutetMiddleware,
	setPhotoPathToBodyMiddleware,
	uploadPhotoMiddleware,
} from '../middlewares/middlewares.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router.use(catchAsync(protectRoutetMiddleware));

router
	.route('/')
	.get(catchAsync(getPlansController))
	.post(
		uploadPhotoMiddleware,
		setPhotoPathToBodyMiddleware,
		catchAsync(createPlanController),
	);

router.route('/:id').get(catchAsync(getPlanByIdController));
export default router;

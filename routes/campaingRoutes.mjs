import { Router } from 'express';
import {
	getAllCampaingsController,
	getCampaingByIdController,
	createCampaingController,
} from '../controllers/campaingController.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const router = Router();

router
	.route('/')
	.get(catchAsync(getAllCampaingsController))
	.post(catchAsync(createCampaingController));
router.route('/:id').get(catchAsync(getCampaingByIdController));

export default router;

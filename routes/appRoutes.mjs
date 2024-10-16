import { Router } from 'express';
import catchAsync from '../utils/catchAsync.mjs';
import createAppController from '../controllers/appController.mjs';

const router = Router();

router.route('/').post(catchAsync(createAppController));

export default router;

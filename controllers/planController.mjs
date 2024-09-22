import {
	createDocController,
	findDocsController,
	findDocByIdController,
} from './controllerFactory.mjs';
import {
	findDocsService,
	findDocByIdService,
} from '../services/serviceFactory.mjs';
import { createPlanService } from '../services/planService.mjs';
import Plan from '../models/plan.mjs';

export const createPlanController = async (req, res, _next) => {
	const { body } = req;
	const { plan } = await createPlanService(body);
	res.status(201).json({
		status: 'success',
		data: {
			plan,
		},
	});
};

export const getPlanByIdController = findDocByIdController(
	findDocByIdService(Plan),
);

export const getPlansController = findDocsController(findDocsService(Plan));

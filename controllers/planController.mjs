import {
	createDocController,
	findDocsController,
	findDocByIdController,
} from './controllerFactory.mjs';
import {
	createDocService,
	findDocsService,
	findDocByIdService,
} from '../services/serviceFactory.mjs';
import Plan from '../models/plan.mjs';

export const createPlanController = createDocController(createDocService(Plan));

export const getPlanByIdController = findDocByIdController(
	findDocByIdService(Plan),
);

export const getPlansController = findDocsController(findDocsService(Plan));

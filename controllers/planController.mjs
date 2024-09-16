import {
	createDocController,
	findDocsController,
} from './controllerFactory.mjs';
import {
	createDocService,
	findDocsService,
} from '../services/serviceFactory.mjs';
import Plan from '../models/plan.mjs';

export const createPlanController = createDocController(createDocService(Plan));

export const getPlansController = findDocsController(findDocsService(Plan));

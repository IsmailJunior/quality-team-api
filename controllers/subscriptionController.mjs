import {
	createDocController,
	findDocsController,
} from './controllerFactory.mjs';
import {
	createDocService,
	findDocsService,
} from '../services/serviceFactory.mjs';
import Subscription from '../models/subscription.mjs';

export const createSubscriptionController = createDocController(
	createDocService(Subscription),
);

export const getSubscriptionController = findDocsController(
	findDocsService(Subscription),
);

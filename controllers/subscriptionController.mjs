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
import Subscription from '../models/subscription.mjs';

export const createSubscriptionController = createDocController(
	createDocService(Subscription),
);

export const getSubscriptionsController = findDocsController(
	findDocsService(Subscription),
);

export const getSubscriptionController = findDocByIdController(
	findDocByIdService(Subscription),
);

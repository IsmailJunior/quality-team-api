import {
	createDocController,
	findDocsController,
	findDocByIdController,
	updateDocController,
	deleteDocController,
} from './controllerFactory.mjs';
import {
	createDocService,
	findDocsService,
	findDocByIdService,
	updateDocService,
	deleteDocService,
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

export const updateSubscriptionController = updateDocController(
	updateDocService(Subscription),
);

export const deleteSubscriptionController = deleteDocController(
	deleteDocService(Subscription),
);

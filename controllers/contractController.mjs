import {
	createDocController,
	findDocsController,
} from './controllerFactory.mjs';
import {
	createDocService,
	findDocsService,
} from '../services/serviceFactory.mjs';
import Contract from '../models/contract.mjs';

export const createContractController = createDocController(
	createDocService(Contract),
);

export const getContractsController = findDocsController(
	findDocsService(Contract),
);

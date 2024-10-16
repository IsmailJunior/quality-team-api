import App from '../models/app.mjs';
import API from '../utils/apikey.mjs';

const createAppService = async (appName) => {
	const apiKey = API.genAPIKey();
	const app = await App.create({ appName, apiKey });
	return {
		app,
	};
};

export default createAppService;

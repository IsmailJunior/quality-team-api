import { Schema, model } from 'mongoose';

const appSchema = new Schema({
	appName: String,
	apiKey: String,
});

const App = model('App', appSchema);

export default App;

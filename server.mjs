import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-import
import chalk from 'chalk';
import app from './app.mjs';

process.on('uncaughtException', (err) => {
	console.log(chalk.bgRed(err.name, err.message));
	console.log('UNCAUGHT EXCEPTION!, Shutting down...');
	process.exit(1);
});

main().then(() => {
	console.log(chalk.bgGreen('Connection to database successful.'));
});

async function main() {
	await mongoose.connect(process.env.DATABASE_URI);
}
const port = process.env.PORT || 2000;

const server = app.listen(port, () => {
	console.log(chalk.bgYellow(`Connection success on port ${port}.`));
});

process.on('unhandledRejection', (err) => {
	console.log(chalk.bgRed(err.name, err.message));
	console.log('UNHANDELD REJECTION!, Shutting down...');
	server.close(() => {
		process.exit(1);
	});
});

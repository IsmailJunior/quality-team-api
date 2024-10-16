import nodemailer from 'nodemailer';
import nodemailerSendgrid from 'nodemailer-sendgrid';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// eslint-disable-next-line import/no-extraneous-dependencies
import ejs from 'ejs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname( __filename );
console.log(path.join(__dirname, `../views/password-reset.ejs`))

class Email {
	constructor(user, url) {
		this.to = user.username;
		this.from = `QualityTeam <${process.env.EMAIL_FROM}>`;
		this.firstName = user.firstName.split(' ')[0];
		this.url = url;
	}

	// eslint-disable-next-line class-methods-use-this
	createTransport() {
		// sendGrid
		return nodemailer.createTransport(
			nodemailerSendgrid({
				apiKey: process.env.SENDGRID_PASSWORD,
			}),
		);
	}

	async send(template, subject) {
		// eslint-disable-next-line no-undef
		const html = await ejs.renderFile(path.join(__dirname, `../views/${template}.ejs`), {
			firstName: this.firstName,
			url: this.url,
			subject,
		} );
		const mailOpts = {
			from: this.from,
			to: this.to,
			subject,
			html,
		};

		await this.createTransport().sendMail(mailOpts);
	}

	async sendWelcome ()
	{
		await this.send('welcome', 'Welcome aboard.')
	}

	async confirmEmail ()
	{
		await this.send('confirm-email', 'Confirm Email.')
	}

	async sendResetPassword() {
		await this.send('reset-password', 'Reset Password.');
	}
}

export default Email;

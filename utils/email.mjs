import nodemailer from 'nodemailer';
import nodemailerSendgrid from 'nodemailer-sendgrid';

class Email {
	constructor(user, url, message) {
		this.to = user.username;
		this.from = `QualityTeam <${process.env.EMAIL_FROM}>`;
		this.firstName = user.firstName.split(' ')[0];
		this.message = message;
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

	async send(subject, message) {
		const mailOpts = {
			from: this.from,
			to: this.to,
			subject: subject,
			text: message,
		};

		await this.createTransport().sendMail(mailOpts);
	}

	async sendResetPassword() {
		await this.send('Password Reset', this.message);
	}
}

export default Email;

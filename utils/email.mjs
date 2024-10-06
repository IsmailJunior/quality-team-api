import nodemailer from 'nodemailer';
import nodemailerSendgrid from 'nodemailer-sendgrid';

class Email {
	constructor(user, url, message) {
		this.to = user.username;
		this.from = `Ismail Salah <${process.env.EMAIL_FROM}>`;
		this.firstName = user.firstName.split(' ')[0];
		this.message = message;
		this.url = url;
	}

	createTransport() {
		// sendGrid
		return nodemailer.createTransport(
			nodemailerSendgrid({
				apiKey: process.env.SENDGRID_PASSWORD,
			}),
		);
		// }
		// return nodemailer.createTransport({
		// 	host: process.env.EMAIL_HOST,
		// 	port: process.env.EMAIL_PORT,
		// 	auth: {
		// 		user: process.env.EMAIL_USERNAME,
		// 		pass: process.env.EMAIL_PASSWORD,
		// 	},
		// });
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

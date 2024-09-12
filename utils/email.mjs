// eslint-disable-next-line import/no-extraneous-dependencies
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	});
	const mailOpts = {
		from: 'Ismail Salah <ismail.merced3@gmail.com>',
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	await transporter.sendMail(mailOpts);
};

export default sendEmail;

import nodemailer from "nodemailer";
import appConfig from "../config/appConfig";
import createHttpError from "http-errors";

export const sendAccountActivationEmail = async ({
	name,
	email,
	activationToken,
}: {
	activationToken: string;
	name: string;
	email: string;
}) => {
	const spaHostUrl = process.env.SPA_HOST || "";
	const activationUrl = new URL(`${spaHostUrl}/activate-account`);

	activationUrl.searchParams.append("activationToken", activationToken);
	activationUrl.searchParams.append("email", email);

	const plainUrl = activationUrl.toString();
	const text = `Hello ${name},\nto activate your account, please follow this link:\n\n${plainUrl}\n\nKind regards,\n${appConfig.appName} Team`;
	const html = `<p>Hello ${name},<br />to activate your account, please follow this link: <a href="${plainUrl}">activate account</a>.</p>
                <p>Kind regards,<br />${appConfig.appName} Team</p>`;

	try {
		const transporter = nodemailer.createTransport({
			host: process.env.MAILER_SMTP_HOST || "",
			port: Number(process.env.MAILER_SMTP_PORT || 465),
			secure: true,
			auth: {
				user: process.env.MAILER_SMTP_USER || "",
				pass: process.env.MAILER_SMTP_PASSWORD || "",
			},
		});

		const result = await transporter.sendMail({
			from: process.env.MAILER_SENDER_ADDRESS || "",
			to: email,
			subject: `${appConfig.appName} account activation`,
			text,
			html,
		});

		Promise.resolve(result);
	} catch (error) {
		console.error(error);

		return Promise.reject(createHttpError(500, "Failed to send activation email."));
	}
};

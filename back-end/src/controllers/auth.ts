import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import createHttpError from "http-errors";
import { db } from "../db";
import { User } from "../types/user";
import { generateJwt, getJwtCookieOptions } from "../library/token";
import { sendAccountActivationEmail } from "../library/email";
import { ErrorCodes } from "../constants";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let { email } = req.body;
		const { name, password } = req.body;

		const emailCheckResults = await db.getPool()?.query<{ email_found: boolean }>({
			text: "SELECT EXISTS ( SELECT id FROM users WHERE email = $1 ) AS email_found",
			values: [email],
		});

		const userExists = emailCheckResults.rows[0].email_found;

		if (userExists) {
			const accountCheckResults = await db.getPool()?.query<{ is_active: boolean }>({
				text:
					"SELECT EXISTS ( " +
					"SELECT id FROM users " +
					"WHERE email = $1 AND activation_token IS NULL AND activated = TRUE " +
					") AS is_active",
				values: [email],
			});

			if (accountCheckResults.rows[0].is_active) {
				throw createHttpError(409, "Email address already picked.");
			}

			const activationCheckResults = await db.getPool()?.query<{ awaiting_activation: boolean }>({
				text:
					"SELECT EXISTS ( " +
					"SELECT id FROM users " +
					"WHERE email = $1 AND activation_token IS NOT NULL " +
					"AND activated = FALSE AND activation_token_expiry > NOW() " +
					") AS awaiting_activation",
				values: [email],
			});

			if (activationCheckResults.rows[0].awaiting_activation) {
				throw createHttpError(409, "Email address already picked.");
			}
		}

		email = email.trim().toLowerCase();

		const rounds = 10;
		const pwHash = await bcrypt.hash(password, rounds);
		const activationToken = randomUUID({ disableEntropyCache: true }).toString();

		if (userExists) {
			await db.getPool()?.query({
				text:
					"UPDATE users " +
					"SET name = $2, pw_hash = $3, activation_token = $4, activation_token_expiry = ( NOW() + INTERVAL '15 minutes' ) " +
					"WHERE email = $1",
				values: [email, name, pwHash, activationToken],
			});
		} else {
			await db.getPool()?.query({
				text:
					"INSERT INTO users ( email, name, pw_hash, activation_token, activation_token_expiry ) " +
					"SELECT $1, $2, $3, $4,( NOW() + INTERVAL '15 minutes' )",
				values: [email, name, pwHash, activationToken],
			});
		}

		await sendAccountActivationEmail({ name, email, activationToken });

		res.status(201).json({ email, name });
	} catch (error) {
		next(error);
	}
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let { email } = req.body;
		const { password } = req.body;

		email = email.trim().toLowerCase();

		const results = await db.getPool()?.query<Pick<User, "id" | "pw_hash">>({
			text:
				"SELECT id, pw_hash FROM users " +
				"WHERE email = $1 AND activation_token IS NULL AND activated = TRUE",
			values: [email],
		});

		if (results.rowCount !== 1) {
			throw createHttpError(401, "Email or password are incorrect.");
		}

		const user = results.rows[0];
		const pwIsValid = await bcrypt.compare(password, user.pw_hash);

		if (!pwIsValid) {
			throw createHttpError(401, "Email or password are incorrect.");
		}

		const { token, cookieOpt } = generateJwt(user.id);

		res.cookie("token", token, cookieOpt);
		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
};

export const logout = async (_req: Request, res: Response, next: NextFunction) => {
	try {
		res.clearCookie("token", getJwtCookieOptions());
		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const results = await db.getPool()?.query<Pick<User, "name" | "email">>({
			text: "SELECT name, email FROM users WHERE id = $1",
			values: [req.auth.userId],
		});

		if (!results.rowCount) {
			throw createHttpError(403, "Unauthorized");
		}

		res.json(results.rows[0]);
	} catch (error) {
		next(error);
	}
};

export const activateAccount = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { activationToken, email } = req.body;

		const results = await db.getPool()?.query<{ account_can_be_activated: boolean }>({
			text:
				"SELECT EXISTS( " +
				"SELECT id FROM users " +
				"WHERE email = $1 AND activation_token = $2 " +
				"AND activated = FALSE AND activation_token_expiry > NOW() " +
				") AS account_can_be_activated",
			values: [email, activationToken],
		});

		if (!results.rows[0].account_can_be_activated) {
			throw createHttpError(404, ErrorCodes.accountCannotBeActivated);
		}

		await db.getPool()?.query({
			text:
				"UPDATE users " +
				"SET activation_token = NULL, activated = TRUE " +
				"WHERE email = $1 AND activation_token = $2 ",
			values: [email, activationToken],
		});

		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
};

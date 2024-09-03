import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { db } from "../db";
import { User } from "../types/user";
import { generateJwt, getJwtCookieOptions } from "../library/token";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let { name, email, password } = req.body;

		const results = await db.getPool()?.query<{ email_found: boolean }>({
			text: "SELECT EXISTS ( SELECT id FROM users WHERE email = $1 ) AS email_found",
			values: [email],
		});

		if (results.rows[0].email_found) {
			throw createHttpError(409, "Email address already picked.");
		}

		email = email.trim().toLowerCase();

		const rounds = 10;
		const pwHash = await bcrypt.hash(password, rounds);

		await db.getPool()?.query({
			text: "INSERT INTO users ( email, name, pw_hash ) VALUES ( $1, $2, $3 )",
			values: [email, name, pwHash],
		});

		res.status(201).json({ email, name });
	} catch (error) {
		next(error);
	}
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let { email, password } = req.body;

		email = email.trim().toLowerCase();

		const results = await db.getPool()?.query<Pick<User, "id" | "pw_hash">>({
			text: "SELECT id, pw_hash FROM users WHERE email = $1",
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

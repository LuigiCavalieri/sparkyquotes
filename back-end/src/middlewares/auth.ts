import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { AuthObj } from "../types";

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
	try {
		if (!req.cookies.token) {
			throw createHttpError(401);
		}

		const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET || "");

		if (!(typeof decoded === "object" && decoded.userId)) {
			throw createHttpError(403);
		}

		req.auth = decoded as AuthObj;

		next();
	} catch (err) {
		next(err);
	}
};

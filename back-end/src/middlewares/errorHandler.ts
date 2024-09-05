import { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";
import { TokenExpiredError } from "jsonwebtoken";

export const errorHandlerMiddleware = (
	error: HttpError | TokenExpiredError | Error,
	_req: Request,
	res: Response,
	next: NextFunction
) => {
	if (res.headersSent) {
		return next(error);
	}

	if (error instanceof TokenExpiredError) {
		return res.status(403).json({ message: "Forbidden" });
	}

	if (error instanceof HttpError) {
		return res.status(error.statusCode).json({ message: error.message });
	}

	res.status(500).json({ message: error?.message || "Something went wrong." });
};

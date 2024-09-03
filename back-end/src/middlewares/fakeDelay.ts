import { Request, Response, NextFunction } from "express";

export const fakeDelayMiddleware = async (_req: Request, _res: Response, next: NextFunction) => {
	if (process.env.NODE_ENV === "development") {
		const min = 50;
		const max = 1500;

		const delay = Math.floor(Math.random() * (max - min) + min);

		await new Promise(resolve => setTimeout(resolve, delay));
	}

	next();
};

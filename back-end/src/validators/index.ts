import { Request, Response, NextFunction } from "express";
import { ValidationChain } from "express-validator";
import createHttpError from "http-errors";
import appConfig from "../config/appConfig";

export const validate = (validations: ValidationChain[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		for (const validation of validations) {
			const result = await validation.run(req);

			if (!result.isEmpty()) {
				const error = result.array()[0];
				/* eslint-disable @typescript-eslint/no-explicit-any */
				const fieldName = (error as any)?.path || "";
				const errorMsg = (fieldName && `${fieldName}: `) + error.msg;

				return next(createHttpError(400, errorMsg));
			}
		}

		next();
	};
};

export const isPersonName = (value: string) => {
	const regex = new RegExp(`^[${appConfig.authorNameAllowedCharsRegex}]+$`, "iu");

	return regex.test(value);
};

export const isPositiveInt = (value: string) => {
	return /^[0-9]+$/.test(value) && Number(value);
};

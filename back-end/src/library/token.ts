import jwt from "jsonwebtoken";
import { CookieOptions } from "express";
import createHttpError from "http-errors";

const minuteInSeconds = 60;
const thirtyMinutes = 30;

export const generateJwt = (userId: number) => {
	if (!process.env.JWT_SECRET) {
		throw createHttpError(500, "Misconfiguration");
	}

	const jwtLifespanInMins = Number(process.env.JWT_LIFESPAN_MINS) || thirtyMinutes;
	const lifespan = jwtLifespanInMins * minuteInSeconds;

	const cookieOpt = getJwtCookieOptions();
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: lifespan,
	});

	return { token, lifespan, cookieOpt };
};

export const getJwtCookieOptions = (): CookieOptions => {
	return {
		path: "/",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
	};
};

import "./types/express-auth";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";

import { db } from "./db";
import { fakeDelayMiddleware } from "./middlewares/fakeDelay";
import { errorHandlerMiddleware } from "./middlewares/errorHandler";
import authRouter from "./api-routes/auth";
import quotesRouter from "./api-routes/quotes";

const apiBasePath = "/api/v1";
const port = process.env.PORT || 4001;
const spaAbsPath = path.join(process.cwd(), "/spa");
const app = express();

app.use(
	cors({
		credentials: true,
		origin: process.env.NODE_ENV === "development" ? process.env.SPA_HOST : undefined,
	})
);
app.use(helmet());
app.disable("x-powered-by");
app.use(cookieParser());
app.use(express.json());
app.use(express.static(spaAbsPath));
app.use(fakeDelayMiddleware);
db.connect();

app.use(apiBasePath, authRouter);
app.use(`${apiBasePath}/quotes`, quotesRouter);
app.use(errorHandlerMiddleware);

app.get("*", (req: Request, res: Response, next: NextFunction) => {
	if (req.url.startsWith(apiBasePath)) {
		return next();
	}

	res.setHeader("X-Robots-Tag", "noindex");
	res.sendFile(spaAbsPath + "/index.html");
});

app.listen(port, () => {
	console.log(`Server running: http://localhost:${port}`);
});

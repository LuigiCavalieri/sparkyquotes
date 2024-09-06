import express from "express";
import * as quotesController from "../controllers/quotes";
import { authMiddleware } from "../middlewares/auth";
import { validateGetQuotes, validateAddQuote } from "../validators/quotes";

const quotesRouter = express.Router();

quotesRouter.use(authMiddleware);
quotesRouter.get("/", validateGetQuotes, quotesController.getQuotes);
quotesRouter.post("/", validateAddQuote, quotesController.addQuote);
quotesRouter.get("/random", quotesController.getRandomQuote);

export default quotesRouter;

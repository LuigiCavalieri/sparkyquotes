import { body, query } from "express-validator";
import { isPositiveInt, validate } from ".";
import appConfig from "../config/appConfig";

const validatePage = query("page")
	.optional()
	.custom(isPositiveInt)
	.withMessage("Must be an integer greater than zero.");

const validateItemsPerPage = query("itemsPerPage")
	.custom(isPositiveInt)
	.withMessage("Must be an integer greater than zero.");

const validateContent = body("content").trim().notEmpty();

const validateAuthor = body("author")
	.optional()
	.trim()
	.isLength({ max: appConfig.authorMaxLength })
	.withMessage(`Cannot exceed ${appConfig.authorMaxLength} characters.`);

export const validateGetQuotes = validate([validatePage, validateItemsPerPage]);

export const validateAddQuote = validate([validateContent, validateAuthor]);

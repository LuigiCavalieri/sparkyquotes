import { body, query } from "express-validator";
import { isPositiveInt, validate } from ".";
import appConfig from "../config/appConfig";

const validateItemsPerPage = query("itemsPerPage")
	.custom(isPositiveInt)
	.withMessage("Must be an integer greater than zero.");

const validatePage = query("page")
	.optional()
	.custom(isPositiveInt)
	.withMessage("Must be an integer greater than zero.");

const validateContent = body("content").trim().notEmpty();

const validateAuthor = body("author")
	.optional()
	.isLength({ max: appConfig.authorMaxLength })
	.withMessage(`Can have a maximum length of ${appConfig.authorMaxLength} characters.`);

export const validateGetQuotes = validate([validateItemsPerPage, validatePage]);

export const validateAddQuote = validate([validateContent, validateAuthor]);

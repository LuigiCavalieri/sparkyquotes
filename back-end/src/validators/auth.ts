import { body } from "express-validator";
import { isPersonName, validate } from ".";
import appConfig from "../config/appConfig";

const validateName = body("name")
	.trim()
	.notEmpty()
	.bail()
	.custom(isPersonName)
	.withMessage("Cannot include special characters.");

const validateEmail = body("email").trim().notEmpty().isEmail();

const validatePassword = body("password")
	.trim()
	.notEmpty()
	.isLength({ min: appConfig.passwordMinLength })
	.withMessage(`Must have a minimum length of ${appConfig.passwordMinLength} characters.`)
	.bail()
	.custom(value => {
		const regex = new RegExp(`^[a-z0-9${appConfig.passwordSpecialChars}]+$`, "i");

		return regex.test(value);
	})
	.withMessage(
		"Must be aphanumeric and can include only these special characters: " +
			appConfig.passwordSpecialChars
	);

const validateActivationToken = body("activationToken")
	.trim()
	.custom(value => /^[a-z0-9-]+$/i.test(value));

export const validateSignup = validate([validateName, validateEmail, validatePassword]);

export const validateLogin = validate([validateEmail]);

export const validateActivateAccount = validate([validateEmail, validateActivationToken]);

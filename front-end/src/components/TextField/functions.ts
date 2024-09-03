import appConfig from "../../config/appConfig";
import { TextFieldInputTypes } from "./TextField.types";

export const validateInput = (
	inputType: TextFieldInputTypes,
	value: string,
	errorCallback: (errorMsg: string) => void
): boolean => {
	let regex;
	let errorMsg = "";

	switch (inputType) {
		case "text":
			if (/[^.\s\p{Letter}'0-9_-]/iu.test(value)) {
				errorMsg = "Cannot include special characters.";
			}
			break;

		case "email":
			regex = /^[a-z0-9]+(?:\.[a-z0-9]+)*@[a-z0-9-]{3,}\.[a-z]{2,5}$/i;

			if (!regex.test(value)) {
				errorMsg = "Please, enter a valid email address.";
			}
			break;

		case "password":
			regex = new RegExp(
				`^[a-z0-9${appConfig.passwordSpecialChars}]{${appConfig.passwordMinLength},}$`,
				"i"
			);

			if (!regex.test(value)) {
				errorMsg = `Password must be an alphanumeric string of at least ${appConfig.passwordMinLength} characters.  
                    It can include only these special characters: ${appConfig.passwordSpecialChars}`;
			}
			break;
	}

	if (errorMsg) {
		errorCallback(errorMsg);

		return false;
	}

	return true;
};

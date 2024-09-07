interface AppConfig {
	appName: string;
	authorMaxLength: number;
	passwordSpecialChars: string;
	passwordMinLength: number;
	authorDefaultName: string;
	authorNameAllowedCharsRegex: string;
}

const appConfig: Readonly<AppConfig> = {
	appName: "SparkyQuotes",
	authorMaxLength: 200,
	passwordSpecialChars: "?!_$/&.",
	passwordMinLength: 8,
	authorDefaultName: "anonymous",
	authorNameAllowedCharsRegex: ".\\s\\p{Letter}0-9',_-",
};

export default Object.freeze(appConfig);

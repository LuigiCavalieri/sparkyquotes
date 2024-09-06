interface AppConfig {
	appName: string;
	authorMaxLength: number;
	passwordSpecialChars: string;
	passwordMinLength: number;
	authorNameAllowedCharsRegex: string;
}

const appConfig: Readonly<AppConfig> = {
	appName: "SparkyQuotes",
	authorMaxLength: 200,
	passwordSpecialChars: "?!_$/&.",
	passwordMinLength: 8,
	authorNameAllowedCharsRegex: ".\\s\\p{Letter}'0-9_-",
};

export default Object.freeze(appConfig);

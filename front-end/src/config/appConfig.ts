interface AppConfig {
	appName: string;
	adminSlug: string;
	passwordSpecialChars: string;
	passwordMinLength: number;
	authorNameMaxLength: number;
	authorDefaultName: string;
	authorNameAllowedCharsRegex: string;
	quotesPerPage: number;
	feedbackTimeout: number;
	reactQueryStaleTime: number;
}

const appConfig: Readonly<AppConfig> = {
	appName: "SparkyQuotes",
	adminSlug: "admin",
	passwordSpecialChars: "?!_$/&.",
	passwordMinLength: 8,
	authorNameMaxLength: 100,
	authorDefaultName: "anonymous",
	authorNameAllowedCharsRegex: ".\\s\\p{Letter}0-9',_-",
	quotesPerPage: 5,
	feedbackTimeout: 3000,
	reactQueryStaleTime: Infinity,
};

export default Object.freeze(appConfig);

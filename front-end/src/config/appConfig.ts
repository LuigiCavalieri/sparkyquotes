interface AppConfig {
	appName: string;
	adminSlug: string;
	passwordSpecialChars: string;
	passwordMinLength: number;
	authorNameMaxLength: number;
	authorDefaultName: string;
	quotesPerPage: number;
	copyFeedbackTimeout: number;
	reactQueryStaleTime: number;
}

const appConfig: Readonly<AppConfig> = {
	appName: "SparkyQuotes",
	adminSlug: "admin",
	passwordSpecialChars: "?!_$/&.",
	passwordMinLength: 8,
	authorNameMaxLength: 100,
	authorDefaultName: "anonymous",
	quotesPerPage: 5,
	copyFeedbackTimeout: 3000,
	reactQueryStaleTime: Infinity,
};

export default Object.freeze(appConfig);

interface AppConfig {
	authorMaxLength: number;
	passwordSpecialChars: string;
	passwordMinLength: number;
}

const appConfig: Readonly<AppConfig> = {
	authorMaxLength: 200,
	passwordSpecialChars: "?!_$/&.",
	passwordMinLength: 8,
};

export default Object.freeze(appConfig);

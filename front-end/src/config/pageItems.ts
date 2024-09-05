import appConfig from "./appConfig";

export type PageItemKey = "admin" | "list" | "login" | "signup" | "activateAccount";

export interface PageItem {
	url: string;
	pageTitle: string;
}

const _pageItems: Readonly<Record<PageItemKey, PageItem>> = {
	login: {
		url: "/",
		pageTitle: appConfig.appName,
	},
	signup: {
		url: "/signup",
		pageTitle: "Create Your Account",
	},
	activateAccount: {
		url: "/activate-account",
		pageTitle: "Your are Almost Done",
	},
	admin: {
		url: `/${appConfig.adminSlug}`,
		pageTitle: "",
	},
	list: {
		url: `/${appConfig.adminSlug}/quotes`,
		pageTitle: "Your Quotes",
	},
};

export const pageItems = Object.freeze(_pageItems);

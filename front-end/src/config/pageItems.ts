import appConfig from "./appConfig";

export type PageItemKey = "admin" | "list" | "login" | "signup";

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

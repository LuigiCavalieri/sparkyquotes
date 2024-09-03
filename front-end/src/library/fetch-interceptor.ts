import { removeStorageItem } from "./local-storage";
import { endpointsUrl } from "../config/endpointsUrl";

const { fetch: originalFetch } = window;

const randomQuoteUrl = String(import.meta.env.VITE_NINJAS_API_URL || "");
const authUrls = [endpointsUrl.login, endpointsUrl.logout, endpointsUrl.signup, endpointsUrl.me];

window.fetch = async (info: RequestInfo | URL, init?: RequestInit) => {
	const url = info.toString();
	const { headers } = init || {};

	const newInit: RequestInit = {
		...(init || {}),
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
	};

	try {
		const response = await originalFetch(info, newInit);

		if (response.ok) {
			return Promise.resolve(response);
		}

		if (
			!randomQuoteUrl.startsWith(url) &&
			!authUrls.includes(url) &&
			[401, 403].includes(response.status)
		) {
			alert("Your session expired. Please, log in again.");
			removeStorageItem("isLoggedIn");
			location.reload();

			return Promise.reject();
		}

		const errorMessage = await response.json();

		return Promise.reject(errorMessage);
	} catch (error) {
		return Promise.reject(error);
	}
};

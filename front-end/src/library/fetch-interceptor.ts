import { removeStorageItem } from "./local-storage";
import { endpointsUrl } from "../config/endpointsUrl";

const { fetch: originalFetch } = window;

const abortController = new AbortController();
const randomQuoteUrl = String(import.meta.env.VITE_NINJAS_API_URL || "");
const authUrls = [endpointsUrl.login, endpointsUrl.logout, endpointsUrl.signup, endpointsUrl.me];

window.fetch = async (info: RequestInfo | URL, init?: RequestInit) => {
	const url = info.toString();
	const isRandomQuoteUrl = randomQuoteUrl.startsWith(url);
	const { headers } = init || {};

	const newInit: RequestInit = {
		...(init || {}),
		signal: abortController.signal,
		credentials: isRandomQuoteUrl ? undefined : "include",
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

		if (!isRandomQuoteUrl && !authUrls.includes(url) && [401, 403].includes(response.status)) {
			abortController.abort();
			removeStorageItem("isLoggedIn");
			alert("Your session expired. Please, log in again.");
			location.reload();

			return Promise.reject();
		}

		const errorMessage = await response.json();

		return Promise.reject(errorMessage);
	} catch (error) {
		return Promise.reject(error);
	}
};

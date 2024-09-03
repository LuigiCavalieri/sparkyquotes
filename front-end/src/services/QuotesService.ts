import { GET, POST } from ".";
import appConfig from "../config/appConfig";
import { endpointsUrl } from "../config/endpointsUrl";
import * as Quotes from "../types/quotes";

export const getRandomQuote = async () => {
	const url = String(import.meta.env.VITE_NINJAS_API_URL || "");
	const apiKey = String(import.meta.env.VITE_NINJAS_API_KEY || "");

	if (!(url && apiKey)) {
		return Promise.reject("Misconfiguration");
	}

	try {
		const data = await GET<Array<{ quote: string; author: string }>>(url, {
			headers: {
				"X-Api-Key": apiKey,
			},
		});

		if (!Array.isArray(data)) {
			throw new Error("Unknown data structure");
		}

		return Promise.resolve(data[0]);
	} catch (error) {
		return Promise.reject(error);
	}
};

export const getQuotes = ({ page }: Quotes.Filters) => {
	const init: Quotes.RequestQueryParams = {
		page: String(page),
		itemsPerPage: String(appConfig.quotesPerPage),
	};

	const paramsObj = new URLSearchParams(init as unknown as Record<string, string>);
	const url = endpointsUrl.quotes + "?" + paramsObj.toString();

	return GET<Quotes.ResponseData>(url);
};

export const saveQuote = (payload: Quotes.ItemWithoutServerGenFields) => {
	return POST<Quotes.ItemWithoutServerGenFields, Quotes.Item>(endpointsUrl.quotes, payload);
};

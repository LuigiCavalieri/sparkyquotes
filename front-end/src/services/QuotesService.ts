import { GET, POST } from ".";
import appConfig from "../config/appConfig";
import { endpointsUrl } from "../config/endpointsUrl";
import {
	Quote,
	QuotesFilters,
	QuotesRequestQueryParams,
	QuotesResponseData,
	QuoteWithoutServerGenFields,
} from "../types/quotes";

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

		const quote: QuoteWithoutServerGenFields = {
			content: data[0]?.quote || "",
			author: data[0]?.author || "",
		};

		return Promise.resolve(quote);
	} catch (error) {
		return Promise.reject(error);
	}
};

export const getQuotes = ({ page, keywords }: QuotesFilters) => {
	const keywordsParamValue = keywords
		?.split(" ")
		.map(value => value.trim())
		.join("|");

	const init: QuotesRequestQueryParams = {
		page: String(page),
		itemsPerPage: String(appConfig.quotesPerPage),
		keywords: keywordsParamValue || "",
	};

	const paramsObj = new URLSearchParams(init as unknown as Record<string, string>);
	const url = endpointsUrl.quotes + "?" + paramsObj.toString();

	return GET<QuotesResponseData>(url);
};

export const saveQuote = (payload: QuoteWithoutServerGenFields) => {
	return POST<QuoteWithoutServerGenFields, Quote>(endpointsUrl.quotes, payload);
};

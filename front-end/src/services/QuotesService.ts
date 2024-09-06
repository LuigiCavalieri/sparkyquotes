import { GET, POST } from ".";
import appConfig from "../config/appConfig";
import { endpointsUrl } from "../config/endpointsUrl";
import {
	Quote,
	QuotesRequestQueryParams,
	QuotesResponseData,
	QuotesSearchFilters,
	QuoteWithoutServerGenFields,
} from "../types/quotes";

export const getQuotes = (page: number, { keywords }: QuotesSearchFilters) => {
	const keywordsParamValue = keywords
		?.replace(/|/g, "")
		.split(" ")
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

export const getRandomQuote = async () => {
	return GET<QuoteWithoutServerGenFields>(endpointsUrl.randomQuote);
};

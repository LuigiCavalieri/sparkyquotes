import { GET, POST } from ".";
import appConfig from "../config/appConfig";
import { endpointsUrl } from "../config/endpointsUrl";
import * as Quotes from "../types/quotes";

export const getQuotes = ({ page }: Quotes.Filters) => {
	const init: Quotes.RequestQueryParams = {
		page: String(page),
		itemsPerPage: String(appConfig.quotesPerPage),
	};

	const paramsObj = new URLSearchParams(init as unknown as Record<string, string>);
	const url = endpointsUrl.quotes + "?" + paramsObj.toString();

	return GET(url);
};

export const saveQuote = (payload: Quotes.ItemWithoutServerGenFields) => {
	return POST(endpointsUrl.quotes, payload);
};

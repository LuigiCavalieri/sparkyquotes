import { createContext } from "react";
import { Quote, QuotesSearchFilters, QuoteWithoutServerGenFields } from "../types/quotes";
import { UseQueryResult } from "react-query";

export interface QuotesQueryState {
	searchFilters: QuotesSearchFilters;
	isRefetching: boolean;
	isLoading: boolean;
	isError: boolean;
}

export type RandomQuoteQueryState = {
	isEnabled: boolean;
	updateEnabled: (enabled: boolean) => void;
} & UseQueryResult<QuoteWithoutServerGenFields>;

export interface SaveQuoteFunctionOptions {
	key: string;
}

export interface QuotesContextInterface {
	quotes: Quote[];
	mainQueryState: QuotesQueryState;
	randomQuoteQueryState: RandomQuoteQueryState;
	pagination: {
		currentPage: number;
		numOfItems: number;
	};
	refreshQuotes: (page: number, searchFilters?: QuotesSearchFilters) => void;
}

export const QuotesContext = createContext<QuotesContextInterface>({
	quotes: [],
	randomQuoteQueryState: {} as RandomQuoteQueryState,
	mainQueryState: {
		searchFilters: {} as QuotesSearchFilters,
		isLoading: false,
		isRefetching: false,
		isError: false,
	},
	pagination: {
		currentPage: 1,
		numOfItems: 0,
	},
	refreshQuotes: () => undefined,
});

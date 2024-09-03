import { createContext } from "react";
import * as Quotes from "../types/quotes";

interface QueryState {
	isLoading: boolean;
	isError: boolean;
}

export interface SaveQuoteFunctionOptions {
	onError?: () => void;
	onSuccess?: () => void;
}

export interface QuotesContextInterface {
	quotes: Quotes.Item[];
	queryState: QueryState & { isRefetching: boolean };
	saveMutationState: QueryState;
	pagination: {
		currentPage: number;
		numOfItems: number;
	};
	refreshQuotes: (filters: Quotes.Filters) => void;
	saveQuote: (newQuote: Quotes.ItemWithoutServerGenFields, options?: SaveQuoteFunctionOptions) => void;
}

export const QuotesContext = createContext<QuotesContextInterface>({
	quotes: [],
	queryState: {
		isLoading: false,
		isRefetching: false,
		isError: false,
	},
	saveMutationState: {
		isLoading: false,
		isError: false,
	},
	pagination: {
		currentPage: 1,
		numOfItems: 0,
	},
	refreshQuotes: () => undefined,
	saveQuote: () => undefined,
});

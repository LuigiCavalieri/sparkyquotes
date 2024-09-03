import { createContext } from "react";
import * as Quotes from "../types/quotes";

export interface QuotesQueryState {
	isRefetching: boolean;
	isLoading: boolean;
	isError: boolean;
}

export interface SaveQuoteFunctionOptions {
	key: string;
}

export interface QuotesContextInterface {
	quotes: Quotes.Item[];
	queryState: QuotesQueryState;
	pagination: {
		currentPage: number;
		numOfItems: number;
	};
	refreshQuotes: (filters: Quotes.Filters) => void;
}

export const QuotesContext = createContext<QuotesContextInterface>({
	quotes: [],
	queryState: {
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

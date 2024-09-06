import { ReactNode, useCallback, useEffect, useState } from "react";
import { QuotesContext } from "../contexts/QuotesContext";
import { useQuery } from "react-query";
import * as QuotesService from "../services/QuotesService";
import { ResponseError } from "../types/error";
import { QuotesResponseData, QuotesSearchFilters } from "../types/quotes";

interface QuotesProviderProps {
	children: ReactNode;
}

export default function QuotesProvider({ children }: QuotesProviderProps) {
	const [pageToLoad, setPageToLoad] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [samePageRefreshCounter, setSamePageRefreshCounter] = useState(0);
	const [mainQueryFilters, setMainQueryFilters] = useState(mainQueryFiltersInitValue);
	const [isRandomQuoteQueryEnabled, setIsRandomQuoteQueryEnabled] = useState(true);

	const {
		data: queryData,
		isError: isQueryError,
		isLoading: isQueryLoading,
		isRefetching: isQueryRefetching,
	} = useQuery<QuotesResponseData, ResponseError>({
		keepPreviousData: true,
		queryKey: ["quotes", pageToLoad, mainQueryFilters, samePageRefreshCounter],
		queryFn: () => QuotesService.getQuotes(pageToLoad, mainQueryFilters),
	});

	const randomQuoteQueryState = useQuery({
		enabled: isRandomQuoteQueryEnabled,
		queryKey: ["randomQuote"],
		queryFn: QuotesService.getRandomQuote,
	});

	const refreshQuotes = useCallback(
		(page: number, searchFilters?: QuotesSearchFilters) => {
			setPageToLoad(page);
			setMainQueryFilters({ ...mainQueryFiltersInitValue, ...(searchFilters || {}) });

			if (page === currentPage && !searchFilters) {
				setSamePageRefreshCounter(value => value + 1);
			}
		},
		[currentPage]
	);

	const updateIsRandomQuoteQueryEnabled = useCallback((enabled: boolean) => {
		setIsRandomQuoteQueryEnabled(enabled);
	}, []);

	useEffect(() => {
		if (!isQueryRefetching && currentPage !== pageToLoad) {
			setCurrentPage(pageToLoad);
		}
	}, [isQueryRefetching, currentPage, pageToLoad]);

	return (
		<QuotesContext.Provider
			value={{
				randomQuoteQueryState: {
					...randomQuoteQueryState,
					isEnabled: isRandomQuoteQueryEnabled,
					updateEnabled: updateIsRandomQuoteQueryEnabled,
				},
				quotes: queryData?.quotes || [],
				mainQueryState: {
					searchFilters: mainQueryFilters,
					isLoading: isQueryLoading,
					isRefetching: isQueryRefetching,
					isError: isQueryError,
				},
				pagination: {
					currentPage,
					numOfItems: queryData?.total_count || 0,
				},
				refreshQuotes,
			}}
		>
			{children}
		</QuotesContext.Provider>
	);
}

const mainQueryFiltersInitValue: QuotesSearchFilters = {
	keywords: "",
};

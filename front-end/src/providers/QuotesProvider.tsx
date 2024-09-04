import { ReactNode, useCallback, useEffect, useState } from "react";
import { QuotesContext } from "../contexts/QuotesContext";
import { useQuery } from "react-query";
import * as QuotesService from "../services/QuotesService";
import { ResponseError } from "../types/error";
import { QuotesFilters, QuotesResponseData } from "../types/quotes";

interface QuotesProviderProps {
	children: ReactNode;
}

export default function QuotesProvider({ children }: QuotesProviderProps) {
	const [pageToLoad, setPageToLoad] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [samePageRefreshCounter, setSamePageRefreshCounter] = useState(0);
	const [isRandomQuoteQueryEnabled, setIsRandomQuoteQueryEnabled] = useState(
		radomQuoteSettingsAvailable
	);

	const {
		data: queryData,
		isError: isQueryError,
		isLoading: isQueryLoading,
		isRefetching: isQueryRefetching,
	} = useQuery<QuotesResponseData, ResponseError>({
		keepPreviousData: true,
		queryKey: ["quotes", pageToLoad, samePageRefreshCounter],
		queryFn: () => QuotesService.getQuotes({ page: pageToLoad }),
	});

	const randomQuoteQueryState = useQuery({
		enabled: isRandomQuoteQueryEnabled,
		queryKey: ["randomQuote"],
		queryFn: QuotesService.getRandomQuote,
	});

	const refreshQuotes = useCallback(
		({ page }: QuotesFilters) => {
			setPageToLoad(page);

			if (page === currentPage) {
				setSamePageRefreshCounter(value => value + 1);
			}
		},
		[currentPage]
	);

	const maybeIsRandomQuoteQueryEnabled = useCallback(
		(enabled: boolean) => {
			if (radomQuoteSettingsAvailable) {
				setIsRandomQuoteQueryEnabled(enabled);
			}
		},
		[radomQuoteSettingsAvailable]
	);

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
					updateEnabled: maybeIsRandomQuoteQueryEnabled,
				},
				quotes: queryData?.quotes || [],
				mainQueryState: {
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

const radomQuoteSettingsAvailable = Boolean(
	import.meta.env.VITE_NINJAS_API_URL && import.meta.env.VITE_NINJAS_API_KEY
);

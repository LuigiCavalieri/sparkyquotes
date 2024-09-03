import { ReactNode, useCallback, useEffect, useState } from "react";
import { QuotesContext } from "../contexts/QuotesContext";
import * as Quotes from "../types/quotes";
import { useQuery } from "react-query";
import * as QuotesService from "../services/QuotesService";
import { ResponseError } from "../types/error";

interface QuotesProviderProps {
	children: ReactNode;
}

export default function QuotesProvider({ children }: QuotesProviderProps) {
	const [pageToLoad, setPageToLoad] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [samePageRefreshCounter, setSamePageRefreshCounter] = useState(0);

	const {
		data: queryData,
		isError: isQueryError,
		isLoading: isQueryLoading,
		isRefetching: isQueryRefetching,
	} = useQuery<Quotes.ResponseData, ResponseError>({
		keepPreviousData: true,
		queryKey: ["quotes", pageToLoad, samePageRefreshCounter],
		queryFn: () => QuotesService.getQuotes({ page: pageToLoad }),
	});

	const refreshQuotes = useCallback(
		({ page }: Quotes.Filters) => {
			setPageToLoad(page);

			if (page === currentPage) {
				setSamePageRefreshCounter(value => value + 1);
			}
		},
		[currentPage]
	);

	useEffect(() => {
		if (!isQueryRefetching && currentPage !== pageToLoad) {
			setCurrentPage(pageToLoad);
		}
	}, [isQueryRefetching, currentPage, pageToLoad]);

	return (
		<QuotesContext.Provider
			value={{
				quotes: queryData?.quotes || [],
				queryState: {
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

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { QuotesContext, SaveQuoteFunctionOptions } from "../contexts/QuotesContext";
import * as Quotes from "../types/quotes";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as QuotesService from "../services/QuotesService";
import { ResponseError } from "../types/error";

interface QuotesProviderProps {
	children: ReactNode;
}

export default function QuotesProvider({ children }: QuotesProviderProps) {
	const queryClient = useQueryClient();
	const onSaveCallbacksRef = useRef<SaveQuoteFunctionOptions | null>(null);
	const [pageToLoad, setPageToLoad] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [dataToDisplay, setDataToDisplay] = useState<Quotes.ResponseData | null>(null);

	const {
		data,
		error: errorOnQuering,
		isLoading: isQueryLoading,
		isRefetching: isQueryRefetching,
	} = useQuery<Quotes.ResponseData, ResponseError>({
		keepPreviousData: true,
		queryKey: ["quotes", pageToLoad],
		queryFn: () => QuotesService.getQuotes({ page: pageToLoad }),
	});

	const {
		isLoading: isSaving,
		mutate: triggerAdd,
		error: errorOnAdding,
	} = useMutation<Quotes.Item, ResponseError, Quotes.ItemWithoutServerGenFields>({
		mutationFn: QuotesService.saveQuote,
		onSuccess: () => {
			if (typeof onSaveCallbacksRef.current?.onSuccess === "function") {
				onSaveCallbacksRef.current.onSuccess();
			}

			setPageToLoad(1);
			queryClient.removeQueries({ queryKey: "quotes" });
		},
		onError: () => {
			if (typeof onSaveCallbacksRef.current?.onError === "function") {
				onSaveCallbacksRef.current.onError();
			}
		},
	});

	const refreshQuotes = useCallback(({ page }: Quotes.Filters) => {
		setPageToLoad(page);
	}, []);

	const saveQuote = useCallback(
		(newQuote: Quotes.ItemWithoutServerGenFields, options?: SaveQuoteFunctionOptions) => {
			onSaveCallbacksRef.current = options || null;

			triggerAdd(newQuote);
		},
		[triggerAdd]
	);

	useEffect(() => {
		if (data && currentPage !== pageToLoad) {
			setDataToDisplay(data);
			setCurrentPage(pageToLoad);
		} else if (data) {
			setDataToDisplay(data);
		}
	}, [data, currentPage, pageToLoad]);

	return (
		<QuotesContext.Provider
			value={{
				quotes: dataToDisplay?.quotes || [],
				queryState: {
					isLoading: isQueryLoading,
					isRefetching: isQueryRefetching,
					isError: Boolean(errorOnQuering),
				},
				saveMutationState: {
					isLoading: isSaving,
					isError: Boolean(errorOnAdding),
				},
				pagination: {
					currentPage,
					numOfItems: dataToDisplay?.total_count || 0,
				},
				refreshQuotes,
				saveQuote,
			}}
		>
			{children}
		</QuotesContext.Provider>
	);
}

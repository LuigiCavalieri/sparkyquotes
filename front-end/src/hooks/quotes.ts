import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { QuotesContext } from "../contexts/QuotesContext";
import { ResponseError } from "../types/error";
import { saveQuote } from "../services/QuotesService";
import { Quote, QuoteWithoutServerGenFields } from "../types/quotes";

export interface UseSaveQuoteCallbacks {
	onSuccess?: (data: Quote, variables: QuoteWithoutServerGenFields) => void;
	onError?: (error: ResponseError, variables: QuoteWithoutServerGenFields) => void;
}

export function useQuotes() {
	return useContext(QuotesContext);
}

export function useSaveQuote(callbacks?: UseSaveQuoteCallbacks) {
	const queryClient = useQueryClient();
	const { refreshQuotes } = useQuotes();

	const result = useMutation<Quote, ResponseError, QuoteWithoutServerGenFields>({
		mutationFn: saveQuote,
		onSuccess: (data, variables) => {
			if (typeof callbacks?.onSuccess === "function") {
				callbacks.onSuccess(data, variables);
			}

			refreshQuotes(1);
			queryClient.removeQueries({ queryKey: ["quotes"] });
		},
		onError: (error, variables) => {
			if (typeof callbacks?.onError === "function") {
				callbacks.onError(error, variables);
			}
		},
	});

	return result;
}

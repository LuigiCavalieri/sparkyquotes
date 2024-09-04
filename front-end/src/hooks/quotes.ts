import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { QuotesContext } from "../contexts/QuotesContext";
import { ResponseError } from "../types/error";
import { saveQuote } from "../services/QuotesService";
import { Quote, QuoteWithoutServerGenFields } from "../types/quotes";

export function useQuotes() {
	return useContext(QuotesContext);
}

export function useSaveQuote(callbacks?: { onSuccess?: () => void; onError?: () => void }) {
	const queryClient = useQueryClient();
	const { refreshQuotes } = useQuotes();

	const result = useMutation<Quote, ResponseError, QuoteWithoutServerGenFields>({
		mutationFn: saveQuote,
		onSuccess: () => {
			if (typeof callbacks?.onSuccess === "function") {
				callbacks.onSuccess();
			}

			const pageOne = 1;

			refreshQuotes({ page: pageOne });
			queryClient.removeQueries({ queryKey: ["quotes"] });
		},
		onError: () => {
			if (typeof callbacks?.onError === "function") {
				callbacks.onError();
			}
		},
	});

	return result;
}

import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { QuotesContext } from "../contexts/QuotesContext";
import { ResponseError } from "../types/error";
import * as Quotes from "../types/quotes";
import { saveQuote } from "../services/QuotesService";

export function useQuotes() {
	return useContext(QuotesContext);
}

export function useSaveQuote(callbacks?: { onSuccess?: () => void; onError?: () => void }) {
	const queryClient = useQueryClient();
	const { refreshQuotes } = useQuotes();

	const result = useMutation<Quotes.Item, ResponseError, Quotes.ItemWithoutServerGenFields>({
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

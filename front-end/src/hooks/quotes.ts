import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { QuotesContext } from "../contexts/QuotesContext";
import { ResponseError } from "../types/error";
import * as Quotes from "../types/quotes";
import { saveQuote } from "../services/QuotesService";

export function useQuotes() {
	return useContext(QuotesContext);
}

export function useSaveQuote(options?: { onSuccess?: () => void; onError?: () => void }) {
	const queryClient = useQueryClient();
	const { refreshQuotes } = useQuotes();

	const result = useMutation<Quotes.Item, ResponseError, Quotes.ItemWithoutServerGenFields>({
		mutationFn: saveQuote,
		onSuccess: () => {
			if (typeof options?.onSuccess === "function") {
				options.onSuccess();
			}

			const pageOne = 1;

			refreshQuotes({ page: pageOne });
			queryClient.removeQueries({ queryKey: ["quotes"] });
		},
		onError: () => {
			if (typeof options?.onError === "function") {
				options.onError();
			}
		},
	});

	return result;
}

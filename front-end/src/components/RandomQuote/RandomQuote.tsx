import Card from "../Card/Card";
import { useQuotes, useSaveQuote } from "../../hooks/quotes";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import RandomQuoteContent from "./RandomQuoteContent/RandomQuoteContent";
import RandomQuoteDismissButton from "./RandomQuoteDismissButton/RandomQuoteDismissButton";
import { useCallback } from "react";

export default function RandomQuote() {
	const { randomQuoteQueryState } = useQuotes();
	const { isError: isMutationError, isLoading: isMutationLoading, mutate } = useSaveQuote();

	const onClickRefresh = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		location.reload();
	};

	const onClickDismiss = useCallback(() => {
		randomQuoteQueryState.updateEnabled(false);
	}, [randomQuoteQueryState]);

	if (!randomQuoteQueryState.isEnabled) {
		return null;
	}

	return (
		<Card testid="random-quote-card">
			{isMutationError && (
				<ErrorMessage canBeDismissed>Failed saving quote. Please, try again.</ErrorMessage>
			)}
			{randomQuoteQueryState.isLoading ? (
				<p className="text-sm text-gray-500">We are looking for a new quote to suggest you...</p>
			) : randomQuoteQueryState.isError || !randomQuoteQueryState.data ? (
				<div className="flex justify-between gap-6">
					<div className="flex items-center">
						<p className="text-sm ">
							{"Sorry, we couldn't find a new quote to suggest you. Please try to "}
							<button type="button" className="underline" onClick={onClickRefresh}>
								refresh the page
							</button>
							{"."}
						</p>
					</div>
					<RandomQuoteDismissButton className="self-start" onClick={onClickDismiss} />
				</div>
			) : (
				<RandomQuoteContent
					quote={randomQuoteQueryState.data}
					isMutationLoading={isMutationLoading}
					isQueryRefetching={randomQuoteQueryState.isRefetching}
					onClickSave={() => mutate(randomQuoteQueryState.data)}
					onClickDismiss={onClickDismiss}
				/>
			)}
		</Card>
	);
}

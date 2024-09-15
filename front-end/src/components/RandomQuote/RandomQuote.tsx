import { useCallback, useState } from "react";
import Card from "../Card/Card";
import { useQuotes, useSaveQuote } from "../../hooks/quotes";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import RandomQuoteContent from "./RandomQuoteContent/RandomQuoteContent";
import RandomQuoteDismissButton from "./RandomQuoteDismissButton/RandomQuoteDismissButton";
import appConfig from "../../config/appConfig";
import { useTimer } from "../../hooks/timer";

export default function RandomQuote() {
	const { setTimer, clearTimer } = useTimer();
	const [showOptimisticSaved, setShowOptimisticSaved] = useState(false);

	const { randomQuoteQueryState } = useQuotes();
	const { isError: isMutationError, mutate } = useSaveQuote({
		onError: () => {
			clearTimer();
			setShowOptimisticSaved(false);
		},
	});

	const handleOnClickSave = useCallback(() => {
		if (randomQuoteQueryState.data) {
			mutate(randomQuoteQueryState.data);
		}

		setShowOptimisticSaved(true);

		setTimer(() => {
			setShowOptimisticSaved(false);
			randomQuoteQueryState.refetch();
		}, appConfig.feedbackTimeout);
	}, [mutate, setTimer, randomQuoteQueryState]);

	const handleOnClickDismiss = useCallback(() => {
		randomQuoteQueryState.updateEnabled(false);
	}, [randomQuoteQueryState]);

	const onClickRefresh = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		location.reload();
	};

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
					<RandomQuoteDismissButton className="self-start" onClick={handleOnClickDismiss} />
				</div>
			) : (
				<RandomQuoteContent
					quote={randomQuoteQueryState.data}
					showSaved={showOptimisticSaved}
					disabled={randomQuoteQueryState.isRefetching}
					onClickSave={handleOnClickSave}
					onClickDismiss={handleOnClickDismiss}
				/>
			)}
		</Card>
	);
}

import { useCallback, useEffect, useRef, useState } from "react";
import Card from "../Card/Card";
import { useQuotes, useSaveQuote } from "../../hooks/quotes";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import RandomQuoteContent from "./RandomQuoteContent/RandomQuoteContent";
import RandomQuoteDismissButton from "./RandomQuoteDismissButton/RandomQuoteDismissButton";
import appConfig from "../../config/appConfig";

export default function RandomQuote() {
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [showOptimisticSaved, setShowOptimisticSaved] = useState(false);

	const { randomQuoteQueryState } = useQuotes();
	const { isError: isMutationError, mutate } = useSaveQuote({
		onError: () => {
			maybeClearTimer();
			setShowOptimisticSaved(false);
		},
	});

	const handleOnClickSave = useCallback(() => {
		if (randomQuoteQueryState.data) {
			mutate(randomQuoteQueryState.data);
		}

		setShowOptimisticSaved(true);

		timerRef.current = setTimeout(() => {
			timerRef.current = null;

			setShowOptimisticSaved(false);
		}, appConfig.feedbackTimeout);
	}, [randomQuoteQueryState.data]);

	const handleOnClickDismiss = useCallback(() => {
		randomQuoteQueryState.updateEnabled(false);
	}, [randomQuoteQueryState]);

	useEffect(() => {
		return maybeClearTimer;
	}, []);

	const onClickRefresh = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		location.reload();
	};

	const maybeClearTimer = () => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);

			timerRef.current = null;
		}
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
					onClickSave={handleOnClickSave}
					onClickDismiss={handleOnClickDismiss}
				/>
			)}
		</Card>
	);
}

import { useState } from "react";
import classNames from "classnames";
import { useQuery } from "react-query";
import { getRandomQuote } from "../../services/QuotesService";
import Card from "../Card/Card";
import { useSaveQuote } from "../../hooks/quotes";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import TextButton from "../TextButton/TextButton";

const settingsAvailable = Boolean(
	import.meta.env.VITE_NINJAS_API_URL && import.meta.env.VITE_NINJAS_API_KEY
);

export default function RandomQuote() {
	const [hiddenOnMobile, setHiddenOnMobile] = useState(true);
	const { isError: isMutationError, isLoading: isMutationLoading, mutate } = useSaveQuote();

	const {
		data,
		isLoading: isQueryLoading,
		isError: isQueryError,
		isRefetching: isQueryRefetching,
		refetch,
	} = useQuery({
		enabled: settingsAvailable,
		queryKey: ["randomQuote"],
		queryFn: getRandomQuote,
	});

	const handleOnClickSave = () => {
		if (!data) {
			return;
		}

		mutate({
			content: data.quote,
			author: data.author,
		});
	};

	const onClickRefresh = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		location.reload();
	};

	if (!settingsAvailable) {
		return null;
	}

	return (
		<Card>
			{isMutationError && (
				<ErrorMessage canBeDismissed>Failed saving quote. Please, try again.</ErrorMessage>
			)}
			{isQueryLoading ? (
				<p className="text-sm text-gray-500">We are looking for a new quote to suggest you...</p>
			) : isQueryError || !data ? (
				<p className="text-sm">
					{"Sorry, we couldn't find a new quote to suggest you. Please try to "}
					<button type="button" className="underline" onClick={onClickRefresh}>
						refresh the page
					</button>
					{"."}
				</p>
			) : (
				<>
					<div className="flex justify-between items-start gap-4">
						<h3
							className={classNames("font-semibold text-sm sm:text-base", {
								"opacity-50": isQueryRefetching,
							})}
						>
							You may like this quote by <em className="text-sky-900">{data.author}</em>
						</h3>
						<div className="flex items-center gap-2">
							<TextButton
								disabled={isQueryRefetching}
								onClick={() => refetch()}
								className="text-sm sm:leading-7"
							>
								Dismiss
							</TextButton>
							<span className="text-gray-300">|</span>
							<TextButton
								disabled={isMutationLoading || isQueryRefetching}
								onClick={handleOnClickSave}
								className={classNames("text-sm sm:leading-7", { "opacity-50": isMutationLoading })}
							>
								{isMutationLoading ? "Saving..." : "Save"}
							</TextButton>
						</div>
					</div>
					<blockquote
						className={classNames("mt-4 sm:block", {
							"opacity-50": isQueryRefetching,
							hidden: hiddenOnMobile,
						})}
					>
						"{data.quote}"
					</blockquote>
					<TextButton
						disabled={isQueryRefetching}
						onClick={() => setHiddenOnMobile(value => !value)}
						className={classNames("text-sm sm:hidden", { "inline-block": hiddenOnMobile })}
					>
						{hiddenOnMobile ? "+ show" : "- hide"}
					</TextButton>
				</>
			)}
		</Card>
	);
}

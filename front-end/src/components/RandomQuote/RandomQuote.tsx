import { getRandomQuote } from "../../services/QuotesService";
import Card from "../Card/Card";
import { useQuery } from "react-query";
import { useSaveQuote } from "../../hooks/quotes";
import classNames from "classnames";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useState } from "react";

const serviceUnavailable = !(
	import.meta.env.VITE_NINJAS_API_URL && import.meta.env.VITE_NINJAS_API_KEY
);

export default function RandomQuote() {
	const [hiddenOnMobile, setHiddenOnMobile] = useState(true);
	const { isError: isMutationError, isLoading: isMutationLoading, mutate } = useSaveQuote();

	const {
		data,
		isLoading: isQueryLoading,
		isError: isQueryError,
	} = useQuery({
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

	if (serviceUnavailable) {
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
						<h3 className="font-semibold text-sm sm:text-normal">
							You may like this quote by <em className="text-sky-900">{data.author}</em>
						</h3>
						<button
							type="button"
							disabled={isMutationLoading}
							onClick={handleOnClickSave}
							className={classNames(
								"text-sky-500 text-sm hover:underline disabled:no-underline sm:leading-7",
								{ "opacity-50": isMutationLoading }
							)}
						>
							{isMutationLoading ? "Saving..." : "Save"}
						</button>
					</div>
					<blockquote
						className={classNames("mt-4 sm:block", {
							hidden: hiddenOnMobile,
						})}
					>
						"{data.quote}"
					</blockquote>
					<button
						type="button"
						onClick={() => setHiddenOnMobile(value => !value)}
						className={classNames(
							"text-sky-500 text-sm hover:underline disabled:no-underline sm:hidden",
							{ "inline-block": hiddenOnMobile }
						)}
					>
						{hiddenOnMobile ? "+ show" : "- hide"}
					</button>
				</>
			)}
		</Card>
	);
}

import { useQuery } from "react-query";
import { getRandomQuote } from "../../services/QuotesService";
import Card from "../Card/Card";
import { useSaveQuote } from "../../hooks/quotes";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import RandomQuoteContent from "./RandomQuoteContent/RandomQuoteContent";

const settingsAvailable = Boolean(
	import.meta.env.VITE_NINJAS_API_URL && import.meta.env.VITE_NINJAS_API_KEY
);

export default function RandomQuote() {
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
		if (data) {
			mutate(data);
		}
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
				<RandomQuoteContent
					quote={data}
					isMutationLoading={isMutationLoading}
					isQueryRefetching={isQueryRefetching}
					onClickSave={handleOnClickSave}
					onClickDismiss={() => refetch()}
				/>
			)}
		</Card>
	);
}

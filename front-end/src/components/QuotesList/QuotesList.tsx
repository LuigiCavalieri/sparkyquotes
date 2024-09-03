import classNames from "classnames";
import useQuotes from "../../hooks/quotes";
import Card from "../Card/Card";
import QuotesListItem from "../QuotesListItem/QuotesListItem";
import PaginationMenu from "../PaginationMenu/PaginationMenu";
import appConfig from "../../config/appConfig";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export default function QuotesList() {
	const { quotes, queryState, pagination, refreshQuotes } = useQuotes();

	const onClickRefresh = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		location.reload();
	};

	return (
		<Card title="Your saved quotes">
			{queryState.isError && (
				<ErrorMessage className="mt-8">
					{"Something didn't work. Please try to "}
					<button type="button" className="underline" onClick={onClickRefresh}>
						refresh the page
					</button>
					{"."}
				</ErrorMessage>
			)}
			{queryState.isLoading ? (
				<p className="text-gray-500 text-sm mt-6 mb-2">Quotes are loading...</p>
			) : !quotes.length ? (
				<p className="text-sm mt-6 mb-2">No quotes found.</p>
			) : (
				<>
					<ol
						data-testid="quotes-list"
						className={classNames({
							"opacity-50": queryState.isRefetching,
						})}
					>
						{quotes.map((quote, idx) => {
							const itemNum = idx + 1 + (pagination.currentPage - 1) * appConfig.quotesPerPage;

							return (
								<QuotesListItem
									key={`QuoteItem_${quote.id}`}
									quote={quote}
									itemIndex={itemNum}
									className={classNames({
										"border-t border-dashed border-t-slate-400": idx !== 0,
									})}
								/>
							);
						})}
					</ol>
					<PaginationMenu
						className="mt-6 mb-2"
						currentPage={pagination.currentPage}
						numOfQuotes={pagination.numOfItems}
						onClick={page => refreshQuotes({ page })}
					/>
				</>
			)}
		</Card>
	);
}

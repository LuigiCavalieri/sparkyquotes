import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { useQuotes } from "../../hooks/quotes";
import Card from "../Card/Card";
import QuotesListItem from "../QuotesListItem/QuotesListItem";
import PaginationMenu from "../PaginationMenu/PaginationMenu";
import appConfig from "../../config/appConfig";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { CopyStatus } from "../../constants";
import { Quote } from "../../types/quotes";
import TextField from "../TextField/TextField";
import { useDebounceAndThrottle } from "../../hooks/debounce-throttle";

export default function QuotesList() {
	const { debounceAndThrottle } = useDebounceAndThrottle();
	const { quotes, mainQueryState, pagination, refreshQuotes } = useQuotes();

	const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [copyStatus, setCopyStatus] = useState(CopyStatus.waiting);
	const [copiedQuoteId, setCopiedQuoteId] = useState<string | null>(null);
	const [searchString, setSearchString] = useState("");
	const [showSearchField, setShowSearchField] = useState(Boolean(quotes.length));
	const [isSearching, setIsSearching] = useState(false);

	const handleOnChangeSearchString = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value;
			const triggerSearch = () => refreshQuotes(1, { keywords: value });

			setSearchString(value);

			if (!value.trim()) {
				triggerSearch();

				return;
			}

			setIsSearching(true);
			debounceAndThrottle(triggerSearch, 1000);
			maybeClearSearchTimer();

			searchTimerRef.current = setTimeout(() => {
				searchTimerRef.current = null;

				setIsSearching(false);
			}, 1000);
		},
		[refreshQuotes, debounceAndThrottle]
	);

	const copyToClipboard = useCallback(async (quote: Quote) => {
		setCopiedQuoteId(quote.id);

		try {
			if (!("clipboard" in navigator)) {
				throw new Error();
			}

			const author = quote.author || appConfig.authorDefaultName;

			await navigator.clipboard.writeText(`${quote.content}\n( ${author} )`);

			setCopyStatus(CopyStatus.copied);
		} catch {
			setCopyStatus(CopyStatus.error);
		} finally {
			maybeClearCopiedTimer();
		}

		copiedTimerRef.current = setTimeout(() => {
			copiedTimerRef.current = null;

			setCopyStatus(CopyStatus.waiting);
		}, appConfig.feedbackTimeout);
	}, []);

	useEffect(() => {
		return () => {
			maybeClearSearchTimer();
			maybeClearCopiedTimer();
		};
	}, []);

	useEffect(() => {
		if (quotes.length && !showSearchField) {
			setShowSearchField(true);
		}
	}, [showSearchField, quotes.length]);

	useEffect(() => {
		if (!mainQueryState.searchFilters.keywords) {
			setSearchString("");
		}
	}, [mainQueryState.searchFilters.keywords]);

	useEffect(() => {
		if (searchTimerRef.current) {
			return;
		}

		setIsSearching(mainQueryState.isRefetching);
	}, [mainQueryState.isRefetching]);

	const maybeClearSearchTimer = () => {
		if (searchTimerRef.current) {
			clearTimeout(searchTimerRef.current);
		}
	};

	const maybeClearCopiedTimer = () => {
		if (copiedTimerRef.current) {
			clearTimeout(copiedTimerRef.current);
		}
	};

	const onClickRefresh = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		location.reload();
	};

	return (
		<Card title="Your saved quotes">
			{mainQueryState.isError && (
				<ErrorMessage className="mt-8">
					{"Something didn't work. Please try to "}
					<button type="button" className="underline" onClick={onClickRefresh}>
						refresh the page
					</button>
					{"."}
				</ErrorMessage>
			)}
			{showSearchField && (
				<TextField
					type="search"
					name="searchKeywords"
					outerClassName="mb-4"
					placeholder="Search by keywords"
					value={searchString}
					onChange={handleOnChangeSearchString}
				/>
			)}
			{mainQueryState.isLoading ? (
				<p className="text-gray-500 text-sm mt-6 mb-2">Quotes are loading...</p>
			) : !quotes.length && isSearching ? (
				<p className="text-gray-500 text-sm mt-6 mb-2">Searching...</p>
			) : !quotes.length ? (
				<p className="text-sm mt-6 mb-2">No quotes found.</p>
			) : (
				<>
					<ol
						data-testid="quotes-list"
						className={classNames({
							"opacity-50": isSearching,
						})}
					>
						{quotes.map((quote, idx) => {
							const itemNum = idx + 1 + (pagination.currentPage - 1) * appConfig.quotesPerPage;

							return (
								<QuotesListItem
									key={`QuoteItem_${quote.id}`}
									quote={quote}
									itemIndex={itemNum}
									copyStatus={copiedQuoteId === quote.id ? copyStatus : CopyStatus.waiting}
									onClickCopy={() => copyToClipboard(quote)}
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
						onClick={page => refreshQuotes(page)}
					/>
				</>
			)}
		</Card>
	);
}

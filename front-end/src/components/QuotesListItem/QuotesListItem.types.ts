import * as Quotes from "../../types/quotes";

export interface QuotesListItemProps {
	quote: Quotes.Item;
	itemIndex: number;
	className?: string;
}

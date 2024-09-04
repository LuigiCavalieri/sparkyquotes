import { Quote } from "../../types/quotes";

export interface QuotesListItemProps {
	quote: Quote;
	itemIndex: number;
	className?: string;
}

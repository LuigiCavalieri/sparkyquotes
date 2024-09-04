import { CopyStatus } from "../../constants";
import { Quote } from "../../types/quotes";

export interface QuotesListItemProps {
	quote: Quote;
	itemIndex: number;
	copyStatus: CopyStatus;
	className?: string;
	onClickCopy: () => void;
}

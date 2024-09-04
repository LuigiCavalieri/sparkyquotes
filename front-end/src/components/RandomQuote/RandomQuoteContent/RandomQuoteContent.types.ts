import { QuoteWithoutServerGenFields } from "../../../types/quotes";

export interface RandomQuoteContentProps {
	quote: QuoteWithoutServerGenFields;
	isQueryRefetching: boolean;
	isMutationLoading: boolean;
	onClickDismiss: () => void;
	onClickSave: () => void;
}

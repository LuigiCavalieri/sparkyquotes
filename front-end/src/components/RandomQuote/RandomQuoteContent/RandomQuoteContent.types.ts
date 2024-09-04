import * as Quotes from "../../../types/quotes";

export interface RandomQuoteContentProps {
	quote: Quotes.ItemWithoutServerGenFields;
	isQueryRefetching: boolean;
	isMutationLoading: boolean;
	onClickDismiss: () => void;
	onClickSave: () => void;
}

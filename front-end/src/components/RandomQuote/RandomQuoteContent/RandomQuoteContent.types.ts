import { QuoteWithoutServerGenFields } from "../../../types/quotes";

export interface RandomQuoteContentProps {
	quote: QuoteWithoutServerGenFields;
	showSaved: boolean;
	disabled: boolean;
	onClickDismiss: () => void;
	onClickSave: () => void;
}

import classNames from "classnames";
import { RandomQuoteContentProps } from "./RandomQuoteContent.types";
import TextButton from "../../TextButton/TextButton";
import { useState } from "react";
import RandomQuoteDismissButton from "../RandomQuoteDismissButton/RandomQuoteDismissButton";

export default function RandomQuoteContent({
	quote,
	showSaved,
	disabled,
	onClickDismiss,
	onClickSave,
}: RandomQuoteContentProps) {
	const [hiddenOnMobile, setHiddenOnMobile] = useState(true);

	return (
		<>
			<div className="flex justify-between items-start gap-4">
				<h3 className="font-semibold text-sm sm:text-base">
					{"You may like this quote by "}
					<em className="text-sky-900" data-testid="random-quote-author">
						{quote.author}
					</em>
				</h3>
				<div className="flex items-center gap-2">
					<RandomQuoteDismissButton disabled={disabled} onClick={onClickDismiss} />
					<span className="text-gray-300">|</span>
					<div className="text-sm font-medium sm:leading-7">
						{showSaved ? (
							<span className="text-green-700">Saved!</span>
						) : (
							<TextButton
								testid="random-quote-save-button"
								disabled={disabled}
								onClick={onClickSave}
							>
								Save
							</TextButton>
						)}
					</div>
				</div>
			</div>
			<blockquote
				data-testid="random-quote-content"
				className={classNames("mt-4 sm:block quotes", {
					hidden: hiddenOnMobile,
					"opacity-50": disabled,
				})}
			>
				{quote.content}
			</blockquote>
			<TextButton
				disabled={disabled}
				className={classNames("text-sm sm:hidden", { "inline-block": hiddenOnMobile })}
				onClick={() => setHiddenOnMobile(value => !value)}
			>
				{hiddenOnMobile ? "+ show" : "- hide"}
			</TextButton>
		</>
	);
}

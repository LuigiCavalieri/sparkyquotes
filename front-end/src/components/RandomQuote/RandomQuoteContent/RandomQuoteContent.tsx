import classNames from "classnames";
import { RandomQuoteContentProps } from "./RandomQuoteContent.types";
import TextButton from "../../TextButton/TextButton";
import { useState } from "react";
import RandomQuoteDismissButton from "../RandomQuoteDismissButton/RandomQuoteDismissButton";

export default function RandomQuoteContent({
	quote,
	showSaved,
	isMutationLoading,
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
					<RandomQuoteDismissButton onClick={onClickDismiss} />
					<span className="text-gray-300">|</span>
					<div className="text-sm font-medium sm:leading-7">
						{isMutationLoading ? (
							<span className="font-normal opacity-50">Saving...</span>
						) : showSaved ? (
							<span className="text-green-700">Saved!</span>
						) : (
							<TextButton testid="random-quote-save-button" onClick={onClickSave}>
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
				})}
			>
				{quote.content}
			</blockquote>
			<TextButton
				onClick={() => setHiddenOnMobile(value => !value)}
				className={classNames("text-sm sm:hidden", { "inline-block": hiddenOnMobile })}
			>
				{hiddenOnMobile ? "+ show" : "- hide"}
			</TextButton>
		</>
	);
}

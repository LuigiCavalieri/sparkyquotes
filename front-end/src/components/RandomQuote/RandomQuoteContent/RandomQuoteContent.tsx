import classNames from "classnames";
import { RandomQuoteContentProps } from "./RandomQuoteContent.types";
import TextButton from "../../TextButton/TextButton";
import { useState } from "react";

export default function RandomQuoteContent({
	quote,
	isQueryRefetching,
	isMutationLoading,
	onClickDismiss,
	onClickSave,
}: RandomQuoteContentProps) {
	const [hiddenOnMobile, setHiddenOnMobile] = useState(true);

	return (
		<>
			<div className="flex justify-between items-start gap-4">
				<h3
					className={classNames("font-semibold text-sm sm:text-base", {
						"opacity-50": isQueryRefetching,
					})}
				>
					{"You may like this quote by "}
					<em className="text-sky-900" data-testid="random-quote-author">
						{quote.author}
					</em>
				</h3>
				<div className="flex items-center gap-2">
					<TextButton
						testid="random-quote-dismiss-button"
						onClick={onClickDismiss}
						className="text-red-600 text-sm sm:leading-7"
					>
						Dismiss
					</TextButton>
					<span className="text-gray-300">|</span>
					<TextButton
						testid="random-quote-save-button"
						disabled={isMutationLoading || isQueryRefetching}
						onClick={onClickSave}
						className={classNames("text-sm sm:leading-7", { "opacity-50": isMutationLoading })}
					>
						{isMutationLoading ? "Saving..." : "Save"}
					</TextButton>
				</div>
			</div>
			<blockquote
				data-testid="random-quote-content"
				className={classNames("mt-4 sm:block", {
					"opacity-50": isQueryRefetching,
					hidden: hiddenOnMobile,
				})}
			>
				"{quote.content}"
			</blockquote>
			<TextButton
				disabled={isQueryRefetching}
				onClick={() => setHiddenOnMobile(value => !value)}
				className={classNames("text-sm sm:hidden", { "inline-block": hiddenOnMobile })}
			>
				{hiddenOnMobile ? "+ show" : "- hide"}
			</TextButton>
		</>
	);
}

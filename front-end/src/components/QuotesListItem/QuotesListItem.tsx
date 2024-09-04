import classNames from "classnames";
import appConfig from "../../config/appConfig";
import { QuotesListItemProps } from "./QuotesListItem.types";
import TextButton from "../TextButton/TextButton";
import { CopyStatus } from "../../constants";
import ClipboardIcon from "../Heroicons/ClipboardIcon";

export default function QuotesListItem({
	quote,
	itemIndex,
	copyStatus,
	className,
	onClickCopy,
}: QuotesListItemProps) {
	const author = quote.author || appConfig.authorDefaultName;

	return (
		<li
			data-before={itemIndex}
			className={classNames(
				"py-4",
				"before:content-[attr(data-before)] before:text-slate-500 before:bg-slate-100 before:rounded-full before:w-8 before:h-8 before:inline-flex before:justify-center before:items-center",
				className
			)}
		>
			<TextButton
				testid="copy-to-clipboard-button"
				title="Copy to clipboard"
				aria-label="Copy to clipboard"
				className="text-sm float-right h-8 flex items-center gap-1"
				colorClassName={classNames({
					"text-green-700": copyStatus === CopyStatus.copied,
					"text-red-700": copyStatus === CopyStatus.error,
				})}
				disabled={copyStatus !== CopyStatus.waiting}
				onClick={() => onClickCopy()}
			>
				{copyStatus === CopyStatus.copied ? (
					<span>Copied</span>
				) : (
					copyStatus === CopyStatus.error && <span>Error</span>
				)}
				<ClipboardIcon />
			</TextButton>
			<figure className="px-4 py-1">
				<blockquote className="quotes">{quote.content?.trim()}</blockquote>
				<figcaption className="text-right text-sm font-medium mt-2 before:content-['by'] before:text-gray-400 before:mr-1 before:font-normal">
					{author}
				</figcaption>
			</figure>
		</li>
	);
}

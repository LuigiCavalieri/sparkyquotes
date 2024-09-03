import classNames from "classnames";
import appConfig from "../../config/appConfig";
import { QuotesListItemProps } from "./QuotesListItem.types";

export default function QuotesListItem({ quote, itemIndex, className }: QuotesListItemProps) {
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
			<figure className="px-4 py-1">
				<blockquote>"{quote.content?.trim()}"</blockquote>
				<figcaption className="text-right text-sm font-medium mt-2 before:content-['by'] before:text-gray-400 before:mr-1 before:font-normal">
					{author}
				</figcaption>
			</figure>
		</li>
	);
}

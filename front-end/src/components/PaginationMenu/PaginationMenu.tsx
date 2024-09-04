import { useMemo } from "react";
import classNames from "classnames";
import appConfig from "../../config/appConfig";
import { PaginationMenuProps } from "./PaginationMenu.types";
import PaginationMenuButton from "./PaginationMenuButton/PaginationMenuButton";
import Arrow from "../Arrow/Arrow";

export default function PaginationMenu({
	currentPage,
	numOfQuotes,
	className,
	onClick,
}: PaginationMenuProps) {
	const { counterText, totalPages } = useMemo(() => {
		const firstItemInPageIndex = 1 + appConfig.quotesPerPage * (currentPage - 1);
		const maxLastItemInPageIndex = firstItemInPageIndex + appConfig.quotesPerPage - 1;
		const lastItemInPageIndex = Math.min(maxLastItemInPageIndex, numOfQuotes);

		return {
			firstItemInPageIndex,
			lastItemInPageIndex,
			totalPages: Math.ceil(numOfQuotes / appConfig.quotesPerPage),
			counterText: `${firstItemInPageIndex} - ${lastItemInPageIndex} / ${numOfQuotes}`,
		};
	}, [currentPage, numOfQuotes]);

	return (
		<div className={classNames("flex justify-between items-center", className)}>
			<PaginationMenuButton
				aria-label="Previous page"
				testid="prev-page-button"
				disabled={currentPage <= 1}
				onClick={() => onClick(Math.max(1, currentPage - 1))}
			>
				<Arrow direction="left" />
			</PaginationMenuButton>
			<span className="text-sm text-gray-500">{counterText}</span>
			<PaginationMenuButton
				aria-label="Next page"
				testid="next-page-button"
				disabled={currentPage >= totalPages}
				onClick={() => onClick(Math.min(totalPages, currentPage + 1))}
			>
				<Arrow direction="right" />
			</PaginationMenuButton>
		</div>
	);
}

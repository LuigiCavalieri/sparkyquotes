export interface PaginationMenuProps {
	currentPage: number;
	numOfQuotes: number;
	className?: string;
	onClick: (page: number) => void;
}

export interface Quote {
	id: string;
	content: string;
	author: string;
	created_at: string;
}

export type QuoteWithoutServerGenFields = Omit<Quote, "id" | "created_at">;

export interface QuotesResponseData {
	total_count: number;
	quotes: Quote[];
}

export interface QuotesRequestQueryParams {
	itemsPerPage: string;
	page: string;
}

export interface QuotesFilters {
	page: number;
}

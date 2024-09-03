export interface Item {
	id: string;
	content: string;
	author: string;
	created_at: string;
}

export type ItemWithoutServerGenFields = Omit<Item, "id" | "created_at">;

export interface ResponseData {
	total_count: number;
	quotes: Item[];
}

export interface RequestQueryParams {
	itemsPerPage: string;
	page: string;
}

export interface Filters {
	page: number;
}

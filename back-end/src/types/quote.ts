import { User } from "./user";

export interface Quote {
	id: number;
	user_id: Pick<User, "id">;
	content: string;
	author: string | null;
	created_at: string;
}

export type QuoteWithoutUserId = Omit<Quote, "user_id">;
export type RandomQuote = Pick<Quote, "content" | "author">;

import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { QuoteWithoutUserId } from "../types/quote";

export const getQuotes = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { itemsPerPage, page } = req.query;

		const limit = Number(itemsPerPage);
		const offset = (Number(page || 1) - 1) * limit;

		const countResults = await db.getPool()?.query<{ total_count: string }>({
			text: "SELECT COUNT( id ) AS total_count " + "FROM quotes " + "WHERE user_id = $1",
			values: [req.auth.userId],
		});

		const total_count = Number(countResults.rows[0].total_count);
		const respData = {
			total_count,
			quotes: [],
		};

		if (!total_count) {
			return res.json(respData);
		}

		const results = await db.getPool()?.query<QuoteWithoutUserId>({
			text:
				"SELECT id, content, author, created_at " +
				"FROM quotes " +
				"WHERE user_id = $1 " +
				"ORDER BY created_at DESC " +
				"OFFSET $2 " +
				"LIMIT $3",
			values: [req.auth.userId, offset, limit],
		});

		if (!results.rowCount) {
			return res.json(respData);
		}

		respData.quotes = results.rows;

		res.json(respData);
	} catch (error) {
		next(error);
	}
};

export const addQuote = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { content, author } = req.body;

		const theContent = content.trim();
		let theAuthor = String(author || "");

		theAuthor = theAuthor.replace(/[^.\s\p{Letter}'0-9_-]/giu, "").trim();

		const results = await db.getPool()?.query<QuoteWithoutUserId>({
			text:
				"INSERT INTO quotes ( user_id, content, author ) " +
				"VALUES ( $1, $2, $3 ) " +
				"RETURNING id, content, author, created_at",
			values: [req.auth.userId, theContent, theAuthor],
		});

		res.status(201).json(results.rows[0]);
	} catch (error) {
		next(error);
	}
};

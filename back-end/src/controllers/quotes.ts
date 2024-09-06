import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { QuoteWithoutUserId } from "../types/quote";
import appConfig from "../config/appConfig";
import { isPersonName } from "../validators";

export const getQuotes = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { page, itemsPerPage, keywords } = req.query;

		const limit = Number(itemsPerPage);
		const offset = (Number(page || 1) - 1) * limit;
		let keywordsCondition = "";

		if (keywords) {
			const needles = String(keywords)
				.split("|")
				.map(value => value.trim())
				.filter(value => /[a-z0-9]/i.test(value) && isPersonName(value));

			if (needles.length) {
				const needlesList = needles.map(value => `'%${value.trim()}%'`).join(",");

				keywordsCondition = ` AND concat_ws(' ', content, author) ILIKE ANY( ARRAY[${needlesList}] ) `;
			}
		}

		const countResults = await db.getPool()?.query<{ total_count: string }>({
			text:
				"SELECT COUNT( id ) AS total_count " +
				"FROM quotes " +
				"WHERE user_id = $1 " +
				keywordsCondition,
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
				keywordsCondition +
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
		let { content, author } = req.body;
		const regex = new RegExp(`[^${appConfig.authorNameAllowedCharsRegex}]`, "giu");

		content = content.trim();
		author = String(author || "")
			.replace(regex, "")
			.trim();

		const results = await db.getPool()?.query<QuoteWithoutUserId>({
			text:
				"INSERT INTO quotes ( user_id, content, author ) " +
				"VALUES ( $1, $2, $3 ) " +
				"RETURNING id, content, author, created_at",
			values: [req.auth.userId, content, author],
		});

		res.status(201).json(results.rows[0]);
	} catch (error) {
		next(error);
	}
};

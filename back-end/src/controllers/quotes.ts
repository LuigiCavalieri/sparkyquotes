import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { QuoteWithoutUserId, RandomQuote } from "../types/quote";
import appConfig from "../config/appConfig";
import createHttpError from "http-errors";

export const getQuotes = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { page, itemsPerPage, keywords } = req.query;

		const respData = {
			total_count: 0,
			quotes: [],
		};

		let needles = [];
		const limit = Number(itemsPerPage);
		const offset = (Number(page || 1) - 1) * limit;

		if (keywords) {
			needles = String(keywords)
				.replace(/%/g, "")
				.split("|")
				.filter(value => Boolean(value.trim()))
				.map(value => `%${value.trim()}%`);

			if (!needles.length) {
				return res.json(respData);
			}
		}

		const getValuesAndKeywordsCondition = (values: unknown[]) => {
			const _values = [...values];
			let keywordsCondition = "";

			if (needles.length) {
				_values.push(needles);

				keywordsCondition =
					` AND concat_ws(' ', content, COALESCE( author, '${appConfig.authorDefaultName}' ) ) ` +
					`ILIKE ANY( $${_values.length} ) `;
			}

			return { values: _values, keywordsCondition };
		};

		const countQueryParams = getValuesAndKeywordsCondition([req.auth.userId]);
		const countResults = await db.getPool()?.query<{ total_count: string }>({
			text:
				"SELECT COUNT( id ) AS total_count " +
				"FROM quotes " +
				"WHERE user_id = $1 " +
				countQueryParams.keywordsCondition,
			values: countQueryParams.values,
		});

		respData.total_count = Number(countResults.rows[0].total_count);

		if (!respData.total_count) {
			return res.json(respData);
		}

		const queryParams = getValuesAndKeywordsCondition([req.auth.userId, offset, limit]);
		const results = await db.getPool()?.query<QuoteWithoutUserId>({
			text:
				"SELECT id, content, author, created_at " +
				"FROM quotes " +
				"WHERE user_id = $1 " +
				queryParams.keywordsCondition +
				"ORDER BY created_at DESC " +
				"OFFSET $2 " +
				"LIMIT $3",
			values: queryParams.values,
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
		author = author || null;

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

export const getRandomQuote = async (_req: Request, res: Response, next: NextFunction) => {
	try {
		const url = String(process.env.NINJAS_API_URL || "");
		const apiKey = String(process.env.NINJAS_API_KEY || "");

		if (!(url && apiKey)) {
			throw createHttpError(500, "Failed retrieving a new quote.");
		}

		const response = await fetch(url, {
			headers: {
				"X-Api-Key": apiKey,
			},
		});

		const data = await response.json();

		if (!Array.isArray(data)) {
			throw createHttpError(500, "Failed retrieving a new quote.");
		}

		const quote: RandomQuote = {
			content: data[0]?.quote.trim() || "",
			author: data[0]?.author.trim() || "",
		};

		if (!quote.content) {
			throw createHttpError(404, "No quote found.");
		}

		res.status(200).json(quote);
	} catch (error) {
		next(error);
	}
};

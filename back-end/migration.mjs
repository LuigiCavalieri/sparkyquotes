import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const { Client } = pg;

const migrateDB = client => {
	return Promise.resolve()
		.then(() =>
			client.query(
				"CREATE TABLE users ( " +
					"id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY, " +
					"email VARCHAR(150) NOT NULL CHECK (email <> ''), " +
					"name VARCHAR(150) NOT NULL CHECK (name <> ''), " +
					"pw_hash VARCHAR(100) NOT NULL, " +
					"activation_token VARCHAR(100), " +
					"activation_token_expiry TIMESTAMP NOT NULL, " +
					"activated BOOLEAN NOT NULL DEFAULT FALSE " +
					")"
			)
		)
		.then(() =>
			client.query(
				"CREATE TABLE quotes ( " +
					"id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY, " +
					"user_id INTEGER REFERENCES users(id), " +
					"author VARCHAR(200) NOT NULL DEFAULT '', " +
					"content TEXT NOT NULL CHECK (content <> ''), " +
					"created_at TIMESTAMP NOT NULL DEFAULT NOW() " +
					")"
			)
		);
};

const main = async () => {
	const client = new Client({
		host: process.env.POSTGRES_HOST || "",
		database: process.env.POSTGRES_DATABASE || "",
		user: process.env.POSTGRES_USER || "",
		password: process.env.POSTGRES_PASSWORD || "",
	});

	try {
		await client.connect();
	} catch {
		console.log("Error connecting to the database");
		process.exit(1);
	}

	try {
		await migrateDB(client);
		console.log("Migration completed");
	} catch (error) {
		console.log("Error migrating database");
		console.error(error);
	}

	try {
		await client.end();
		process.exit(0);
	} catch (error) {
		console.log("Error closing connection to the database");
		console.log(error);
		process.exit(1);
	}
};

main();

import { Pool } from "pg";

interface DB {
	pool: Pool;
	getPool: () => Pool | null;
	connect: () => void;
	close: () => void;
}

export const db: DB = {
	pool: null,
	getPool: function () {
		if (!this.pool) {
			this.connect();
		}

		return this.pool;
	},
	connect: async function () {
		process.once("SIGINT", async () => {
			this.close();
			console.log("DB connection closed: app quit");
			process.exit(0);
		});

		process.once("SIGUSR2", async () => {
			this.close();
			console.log("DB connection closed: nodemon");
			process.kill(process.pid, "SIGUSR2");
		});

		try {
			this.pool = new Pool({
				host: process.env.POSTGRES_HOST || "",
				database: process.env.POSTGRES_DB || "",
				user: process.env.POSTGRES_USER || "",
				password: process.env.POSTGRES_PASSWORD || "",
				idleTimeoutMillis: 30000,
			});

			await this.pool.connect();

			console.log("DB connected to host.");
		} catch (error) {
			console.log("DB connection error: " + error.message);
			process.exit(1);
		}
	},
	close: async function () {
		try {
			await this.pool?.end();
		} catch (error) {
			console.log("DB connection couldn't be closed: " + error);
		}
	},
};

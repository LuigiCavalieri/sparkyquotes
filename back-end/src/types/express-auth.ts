import { AuthObj } from ".";

declare module "express-serve-static-core" {
	interface Request {
		auth?: AuthObj;
	}
}

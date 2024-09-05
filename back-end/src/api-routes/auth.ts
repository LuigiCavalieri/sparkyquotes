import express from "express";
import * as authController from "../controllers/auth";
import { authMiddleware } from "../middlewares/auth";
import { validateSignup, validateLogin, validateActivateAccount } from "../validators/auth";

const authRouter = express.Router();

authRouter.post("/signup", validateSignup, authController.signup);
authRouter.post("/login", validateLogin, authController.login);
authRouter.post("/logout", authMiddleware, authController.logout);
authRouter.patch("/activate-account", validateActivateAccount, authController.activateAccount);
authRouter.get("/me", authMiddleware, authController.me);

export default authRouter;

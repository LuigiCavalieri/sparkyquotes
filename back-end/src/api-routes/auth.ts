import express from "express";
import * as authController from "../controllers/auth";
import { authMiddleware } from "../middlewares/auth";
import { validateSignup, validateLogin } from "../validators/auth";

const authRouter = express.Router();

authRouter.post("/signup", validateSignup, authController.signup);
authRouter.post("/login", validateLogin, authController.login);
authRouter.post("/logout", authMiddleware, authController.logout);
authRouter.get("/me", authMiddleware, authController.me);

export default authRouter;

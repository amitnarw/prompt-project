import { Router } from "express";
import { login, logout, register, renewToken } from "@/api/controllers/auth.controller.js";
import { checkAuthenticationRefresh } from "@/api/middlewares/checkAuthentication.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/logout", checkAuthenticationRefresh, logout);
router.get("/renew-token", checkAuthenticationRefresh, renewToken);

export default router;

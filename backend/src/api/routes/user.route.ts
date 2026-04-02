import { Router } from "express";
import { getSession } from "@/api/controllers/user.controller.js";
import { checkAuthentication } from "@/api/middlewares/checkAuthentication.js";

const router = Router();

router.get("/get-user-session", checkAuthentication, getSession);

export default router;

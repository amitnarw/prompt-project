import { Router } from "express";
import { getAllUsers } from "@/api/controllers/admin.controller.js";
import { checkAuthentication } from "@/api/middlewares/checkAuthentication.js";
import { checkAuthorization } from "@/api/middlewares/checkAuthorization.js";

const router = Router();

router.get("/users", checkAuthentication, checkAuthorization("user", "canReadList"), getAllUsers);

export default router;

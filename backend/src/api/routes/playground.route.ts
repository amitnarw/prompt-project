import { Router } from "express";
import { runPrompt } from "@/api/controllers/playground.controller.js";
import { checkAuthentication } from "@/api/middlewares/checkAuthentication.js";
import { decyptPayload } from "@/api/middlewares/decyptPayload.js";
import { playgroundSchema } from "../../../src/middleware/validateRequest.js";

const router = Router();

router.post("/run", checkAuthentication, decyptPayload, runPrompt);

export default router;

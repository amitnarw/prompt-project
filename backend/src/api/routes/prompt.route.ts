import { Router } from "express";
import {
  getPrompts,
  getPromptById,
  createPrompt,
  updatePrompt,
  deletePrompt,
  upvotePrompt,
  downvotePrompt,
  forkPrompt,
  getPromptVersions,
} from "@/api/controllers/prompt.controller.js";
import { checkAuthentication } from "@/api/middlewares/checkAuthentication.js";
import { decyptPayload } from "@/api/middlewares/decyptPayload.js";
import {
  createPromptSchema,
  updatePromptSchema,
  forkPromptSchema,
  idParamSchema,
  paginationQuerySchema,
} from "../../../src/middleware/validateRequest.js";

const router = Router();

router.get("/", checkAuthentication, getPrompts);
router.get("/:id", checkAuthentication, getPromptById);
router.post("/", checkAuthentication, decyptPayload, createPrompt);
router.put("/:id", checkAuthentication, decyptPayload, updatePrompt);
router.delete("/:id", checkAuthentication, deletePrompt);
router.post("/:id/upvote", checkAuthentication, upvotePrompt);
router.post("/:id/downvote", checkAuthentication, downvotePrompt);
router.post("/:id/fork", checkAuthentication, decyptPayload, forkPrompt);
router.get("/:id/versions", checkAuthentication, getPromptVersions);

export default router;

import { type Request, type Response } from "express";
import { sseManager } from "@/infra/sse/manager";
import { sendError } from "@/utils/response";
import { getSession } from "@/lib/auth-helpers.js";

export const connect = async (req: Request, res: Response) => {
  let userId = "anonymous";
  const session = await getSession(req);
  if (session?.user) {
    userId = (session.user as { id: string }).id;
  }

  try {
    await sseManager.registerClient(userId, req, res);
  } catch (error) {
    return sendError(res, 500, "Failed to establish SSE connection");
  }
};
import { type Request, type Response } from "express";
import { sseManager } from "@/infra/sse/manager";
import { sendError } from "@/utils/response";

export const connect = async (req: Request, res: Response) => {
  const userId = req.cookies.user_data ? (req.userId ?? "anonymous") : "anonymous";

  try {
    await sseManager.registerClient(userId, req, res);
  } catch (error) {
    return sendError(res, 500, "Failed to establish SSE connection");
  }
};

import { type Request, type Response, type NextFunction } from "express";
import { sendError } from "@/utils/response.js";
import { getSession } from "@/lib/auth-helpers.js";

export const checkAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await getSession(req);
  if (!session) {
    return sendError(res, 401, "Unauthorized");
  }
  req.userId = (session.user as { id: string }).id;
  next();
};

export const checkAuthenticationRefresh = checkAuthentication;
import { sendError } from "@/utils/response";
import { verifyToken } from "@/utils/tokenUtils";
import { type NextFunction, type Request, type Response } from "express";

export const checkAuthentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      return sendError(res, 401, "Unauthorized");
    }

    const accessTokenVerification = await verifyToken(accessToken, "access_token");

    if (!accessTokenVerification?.success) {
      return sendError(res, 401, "Unauthorized");
    }

    req.userId = accessTokenVerification?.data?.userId as string;
    req.role = accessTokenVerification?.data?.role as string;
    next();
  } catch (error) {
    return sendError(res, 401, "Unauthorized");
  }
};

export const checkAuthenticationRefresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return sendError(res, 401, "Unauthorized");
    }

    const refreshTokenVerification = await verifyToken(refreshToken, "refresh_token");

    if (!refreshTokenVerification?.success) {
      return sendError(res, 401, "Unauthorized");
    }

    req.userId = refreshTokenVerification?.data?.userId as string;
    req.role = refreshTokenVerification?.data?.role as string;
    next();
  } catch (error) {
    return sendError(res, 401, "Unauthorized");
  }
};

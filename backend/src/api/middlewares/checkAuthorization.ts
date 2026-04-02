import { type Request, type Response, type NextFunction } from "express";
import { sendError } from "@/utils/response";
import { decryptData } from "@/utils/encryptDecryptPayload";

interface UserData {
  id: string;
  email?: string;
  name?: string;
  role: { name: string; permissions: Array<{ canReadList: boolean; canReadSingle: boolean; canCreate: boolean; canUpdate: boolean; canDelete: boolean; module: { name: string } }> };
}

export const checkAuthorization = (module: string, action: "canReadList" | "canReadSingle" | "canCreate" | "canUpdate" | "canDelete") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userDataCookie = req.cookies.user_data;

      if (!userDataCookie) {
        return sendError(res, 401, "Unauthorized");
      }

      const userData = await decryptData<UserData>(userDataCookie);

      if (!userData) {
        return sendError(res, 401, "Unauthorized");
      }

      // Admin bypass
      if (userData.role?.name === "admin") {
        return next();
      }

      const permission = userData.role?.permissions?.find(
        (p) => p.module?.name === module
      );

      if (!permission?.[action]) {
        return sendError(res, 403, "Insufficient permissions");
      }

      next();
    } catch (error) {
      return sendError(res, 401, "Unauthorized");
    }
  };
};

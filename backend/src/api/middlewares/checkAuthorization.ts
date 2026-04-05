import { type Request, type Response, type NextFunction } from "express";
import { sendError } from "@/utils/response.js";
import { getSession } from "@/lib/auth-helpers.js";

interface Permission {
  module: { name: string };
  canReadList: boolean;
  canReadSingle: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

interface UserWithRole {
  role?: { name: string; permissions: Permission[] };
}

export const checkAuthorization = (
  module: string,
  action: "canReadList" | "canReadSingle" | "canCreate" | "canUpdate" | "canDelete"
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await getSession(req);
    if (!session) {
      return sendError(res, 401, "Unauthorized");
    }
    const user = session.user as UserWithRole;
    if (user.role?.name === "admin") return next();
    const permission = user.role?.permissions?.find((p) => p.module?.name === module);
    if (!permission?.[action]) {
      return sendError(res, 403, "Insufficient permissions");
    }
    next();
  };
};
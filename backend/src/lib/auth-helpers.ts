import { fromNodeHeaders } from "better-auth/node";
import { auth } from "@/lib/auth.js";
import type { Request } from "express";

export async function getSession(req: Request) {
  return auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
}
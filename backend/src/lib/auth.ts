import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prismaClient } from "@/lib/prismaClient.js";

export const auth = betterAuth({
  database: prismaAdapter(prismaClient, { provider: "postgresql" }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      accessType: "offline",
      prompt: "select_account consent",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
  },
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  trustedOrigins: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
});

import { jwtSign, jwtVerify } from "jsonwebtoken";

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || "default-secret-change-me";

interface EncryptOptions {
  expiresIn?: string;
}

export async function encryptData(data: any): Promise<string> {
  const payload = JSON.stringify(data);
  const encrypted = jwtSign({ data: payload }, ENCRYPTION_SECRET, { expiresIn: "30d" });
  return encrypted;
}

export async function decryptData<T = any>(token: string): Promise<T | null> {
  try {
    const decoded = jwtVerify(token, ENCRYPTION_SECRET) as any;
    return JSON.parse(decoded.data);
  } catch {
    return null;
  }
}

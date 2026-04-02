import { type Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  data: string | null;
  message?: string;
}

export async function sendSuccess<T>(
  res: Response,
  data?: T,
  message?: string,
  code: number = 200
) {
  const response: ApiResponse<T> = {
    success: true,
    data: data as any,
    message,
  };
  return res.status(code).json(response);
}

export async function sendError(res: Response, code: number, message: string) {
  const response: ApiResponse<null> = {
    success: false,
    data: null,
    message,
  };
  return res.status(code || 500).json(response);
}

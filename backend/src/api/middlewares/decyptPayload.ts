import { type Request, type Response, type NextFunction } from 'express';
import { sendError } from '@/utils/response';
import { decryptData } from '@/utils/encryptDecryptPayload';

export const decyptPayload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { payload } = req.body;

    if (!payload) {
      return sendError(res, 400, 'Payload is required');
    }

    const decrypted = await decryptData(payload);

    if (!decrypted) {
      return sendError(res, 400, 'Failed to decrypt payload');
    }

    req.body = { ...decrypted, ...req.body };
    next();
  } catch (error) {
    return sendError(res, 400, 'Failed to decrypt payload');
  }
};

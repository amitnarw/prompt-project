import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const getSecret = (
  type: 'access_token' | 'refresh_token' | 'password_reset' | 'email_verification'
) => {
  switch (type) {
    case 'access_token':
      return new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET || 'access-secret-change-me');
    case 'refresh_token':
      return new TextEncoder().encode(
        process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-change-me'
      );
    case 'password_reset':
      return new TextEncoder().encode(
        process.env.PASSWORD_RESET_TOKEN_SECRET || 'password-reset-secret'
      );
    case 'email_verification':
      return new TextEncoder().encode(
        process.env.EMAIL_VERIFICATION_TOKEN_SECRET || 'email-verification-secret'
      );
  }
};

const getExpiry = (
  type: 'access_token' | 'refresh_token' | 'password_reset' | 'email_verification'
) => {
  switch (type) {
    case 'access_token':
      return process.env.ACCESS_TOKEN_EXPIRY || '1h';
    case 'refresh_token':
      return process.env.REFRESH_TOKEN_EXPIRY || '30d';
    case 'password_reset':
      return process.env.PASSWORD_RESET_TOKEN_EXPIRY || '1h';
    case 'email_verification':
      return process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY || '1d';
  }
};

function parseExpiry(expiry: string): number {
  const num = parseInt(expiry, 10);
  const unit = expiry.replace(/[0-9]/g, '').toLowerCase();
  switch (unit) {
    case 's':
      return num * 1000;
    case 'm':
      return num * 60 * 1000;
    case 'h':
      return num * 60 * 60 * 1000;
    case 'd':
      return num * 24 * 60 * 60 * 1000;
    default:
      return num * 1000;
  }
}

export async function createToken(
  payload: JWTPayload,
  type: 'access_token' | 'refresh_token' | 'password_reset' | 'email_verification'
): Promise<{ success: boolean; data?: string }> {
  try {
    const secret = getSecret(type);
    const expiry = getExpiry(type);
    const expiryMs = parseExpiry(expiry);

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(new Date(Date.now() + expiryMs))
      .sign(secret);

    return { success: true, data: token };
  } catch (error) {
    return { success: false };
  }
}

export async function verifyToken(
  token: string,
  type: 'access_token' | 'refresh_token' | 'password_reset' | 'email_verification'
): Promise<{ success: boolean; data?: JWTPayload }> {
  try {
    const secret = getSecret(type);
    const { payload } = await jwtVerify(token, secret);
    return { success: true, data: payload };
  } catch {
    return { success: false };
  }
}

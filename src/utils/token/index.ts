import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import { devConfig } from "../../config/env/dev.config";
interface TokenPayload {
  id: string;
}

type StringValue =
  | `${number}`
  | `${number}ms`
  | `${number}s`
  | `${number}m`
  | `${number}h`
  | `${number}d`
  | `${number}y`;

/**
 * Helper function to normalize expiresIn value
 */
function resolveExpiresIn(
  value: string | undefined,
  fallback: StringValue
): number | StringValue {
  if (!value) return fallback;

  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  return value as StringValue;
}

const JWT_SECRET = devConfig.JWT_SECRET || "defaultSecret";
const ACCESS_EXPIRE = devConfig.ACCESS_EXPIRE as StringValue | undefined;
const REFRESH_EXPIRE = devConfig.REFRESH_EXPIRE as StringValue | undefined;

export function generateAccessToken(payload: TokenPayload): string {
  const expiresIn = resolveExpiresIn(ACCESS_EXPIRE, devConfig.ACCESS_EXPIRE as StringValue);
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function generateRefreshToken(payload: TokenPayload): string {
  const expiresIn = resolveExpiresIn(REFRESH_EXPIRE, devConfig.REFRESH_EXPIRE as StringValue);
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): TokenPayload & JwtPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload & JwtPayload;
}

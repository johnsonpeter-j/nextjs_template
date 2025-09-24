import jwt, { SignOptions, JwtPayload, Secret } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as Secret; // assert it's defined

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in .env.local");
}

// Sign JWT
export function signToken(payload: object, expiresIn: SignOptions["expiresIn"] = "1d"): string {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload as JwtPayload, JWT_SECRET, options);
}

// Verify JWT
export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

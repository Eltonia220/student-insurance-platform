import { SignJWT, jwtVerify, decodeJwt } from "jose";

const secret = new TextEncoder().encode(
  process.env.REACT_APP_JWT_SECRET || "your-fallback-secret-key",
);

// Generate token (replaces jwt.sign())
export const generateToken = async (payload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);
};

// Verify token (replaces jwt.verify())
export const verifyToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
};

// Decode token without verification (replaces jwt.decode())
export const decodeToken = (token) => {
  return decodeJwt(token);
};

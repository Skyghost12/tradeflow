import jwt from "jsonwebtoken";

/**
 * Generates a short-lived access token. Sent in the JSON response body;
 * the frontend keeps this in memory only (never localStorage) to limit
 * the blast radius of an XSS attack.
 */
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
  });
};

/**
 * Generates a long-lived refresh token. This gets set as an httpOnly
 * cookie so client-side JS can never read or exfiltrate it.
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d",
  });
};

export const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/api/auth", // only sent to auth endpoints, not the whole API
  });
};

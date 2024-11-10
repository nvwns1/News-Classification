import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { accessTokenPayload, refreshTokenPayload } from "../types/tokenTypes";
dotenv.config();

const generateToken = (payload) => {
  return jwt.sign({ data: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

const generateRefreshToken = (payload: refreshTokenPayload) => {
  return jwt.sign({ data: payload }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION,
  });
};

const generateAccessToken = (payload: accessTokenPayload) => {
  return jwt.sign({ data: payload }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION,
  });
};

const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (e) {
    console.log("refresh token error", e);
    throw new Error(e);
  }
};

const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      return "expired";
    }
    throw new Error(e);
  }
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    throw new Error(e);
  }
};

export {
  generateToken,
  verifyToken,
  generateRefreshToken,
  generateAccessToken,
  verifyRefreshToken,
  verifyAccessToken,
};

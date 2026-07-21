import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "bike-admin";
const encoder = new TextEncoder();

function sessionKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not configured.");
  return encoder.encode(secret);
}

export function passwordIsValid(candidate: string) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;

  const expected = Buffer.from(password);
  const received = Buffer.from(candidate);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function createSession() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(sessionKey());
}

export async function isAdmin(token?: string) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, sessionKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export const adminCookie = {
  name: COOKIE_NAME,
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  },
};

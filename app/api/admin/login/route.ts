import { NextResponse } from "next/server";

import { adminCookie, createSession, passwordIsValid } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.password !== "string" || !passwordIsValid(body.password)) {
    return NextResponse.json({ error: "That password is not right." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookie.name, await createSession(), adminCookie.options);
  return response;
}

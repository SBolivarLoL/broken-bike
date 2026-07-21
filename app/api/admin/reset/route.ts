import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { adminCookie, isAdmin } from "@/lib/auth";
import { saveBikeRecord } from "@/lib/store";

export async function POST(request: Request) {
  const token = (await cookies()).get(adminCookie.name)?.value;
  if (!(await isAdmin(token))) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const note = typeof body?.note === "string" ? body.note.trim() : "";
  if (!note || note.length > 280) {
    return NextResponse.json({ error: "Add a short note (up to 280 characters)." }, { status: 400 });
  }

  try {
    const record = await saveBikeRecord(note);
    return NextResponse.json(record);
  } catch {
    return NextResponse.json({ error: "Could not save this incident. Check the storage settings." }, { status: 503 });
  }
}

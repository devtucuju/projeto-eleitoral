import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/admin-auth";
import { headers } from "next/headers";

// POST /api/admin/logout (programático)
export async function POST() {
  await clearAdminCookie();
  return NextResponse.json({ ok: true });
}

// GET /api/admin/logout (link direto - redireciona pro login)
export async function GET(req: Request) {
  await clearAdminCookie();
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || "http";
  return NextResponse.redirect(`${proto}://${host}/admin/login`);
}

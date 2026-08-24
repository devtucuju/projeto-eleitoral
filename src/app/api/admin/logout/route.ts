import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/admin-auth";

// POST /api/admin/logout (programático)
// GET /api/admin/logout (link direto do sidebar - redireciona pro login)
export async function POST() {
  await clearAdminCookie();
  return NextResponse.json({ ok: true });
}

export async function GET() {
  await clearAdminCookie();
  return NextResponse.redirect(new URL("/admin/login", "http://localhost:3000"));
}

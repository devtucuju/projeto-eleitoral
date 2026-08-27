import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/admin-auth";

// POST /api/admin/logout (única forma de deslogar)
export async function POST() {
  await clearAdminCookie();
  return NextResponse.json({ ok: true });
}

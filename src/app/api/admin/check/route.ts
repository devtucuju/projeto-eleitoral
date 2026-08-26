import { NextResponse } from "next/server";
import { getAdminFromCookie } from "@/lib/admin-auth";

// GET /api/admin/check - debug
export async function GET() {
  const admin = await getAdminFromCookie();
  return NextResponse.json({ admin });
}

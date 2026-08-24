import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signAdminToken, setAdminCookie } from "@/lib/admin-auth";
import bcrypt from "bcryptjs";

// POST /api/admin/login
// Body: { email, password }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha obrigatórios" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    const token = await signAdminToken({
      id: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role,
    });
    await setAdminCookie(token);

    return NextResponse.json({ ok: true, nome: user.nome, role: user.role });
  } catch (err) {
    console.error("Erro no login:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

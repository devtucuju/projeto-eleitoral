import { redirect } from "next/navigation";
import { getAdminFromCookie } from "@/lib/admin-auth";
import { AdminSidebar } from "./AdminSidebar";
import { prisma } from "@/lib/prisma";
import { Toaster } from "@/components/motion/Toaster";

// Layout do Painel Admin do scampanha
// Responsivo: drawer no mobile, sidebar fixa no desktop
// Sidebar SÓ aparece se houver sessão ativa

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminFromCookie();

  // /admin/login (e qualquer rota sem auth): sem sidebar
  if (!admin) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--celula-fundo)" }}>
        {children}
        <Toaster />
      </div>
    );
  }

  const pendentes = await prisma.membro.count({ where: { status: "pendente" } });

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar adminNome={admin.nome} pendentes={pendentes} />
      <main className="min-w-0 flex-1">{children}</main>
      <Toaster />
    </div>
  );
}

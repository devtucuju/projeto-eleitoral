import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MembrosClient } from "./MembrosClient";

export const dynamic = "force-dynamic";

async function getData() {
  const membros = await prisma.membro.findMany({
    include: { celula: true },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
  const celulas = await prisma.celula.findMany({
    include: { candidato: { select: { nome: true } } },
    orderBy: [{ cidade: "asc" }, { nome: "asc" }],
  });
  const total = membros.length;
  const pendentes = membros.filter((m) => m.status === "pendente").length;
  const inativos = membros.filter((m) => m.status === "inativo").length;
  const lideres = membros.filter((m) => m.isLideranca).length;
  return { membros, celulas, total, pendentes, inativos, lideres };
}

export default async function AdminMembrosPage() {
  const admin = await getAdminFromCookie();
  if (!admin) redirect("/admin/login");
  const data = await getData();

  return (
    <div className="p-4 md:p-6">
      {/* Breadcrumb / Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <nav className="mb-2 text-xs text-gray-500">
            <Link href="/admin/dashboard" className="hover:text-gray-700">Dashboard</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">Membros</span>
          </nav>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">Membros</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie cabos, lideranças e aprovações da campanha
          </p>
        </div>
      </div>

      <MembrosClient membros={data.membros} celulas={data.celulas} stats={{
        total: data.total, pendentes: data.pendentes, inativos: data.inativos, lideres: data.lideres,
      }} />
    </div>
  );
}

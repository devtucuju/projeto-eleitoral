import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PessoasClient } from "./PessoasClient";

export const dynamic = "force-dynamic";

async function getData() {
  const [pessoas, totalConversas] = await Promise.all([
    prisma.pessoa.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { conversas: true } },
        conversas: {
          orderBy: { createdAt: "desc" },
          take: 3,
          include: { membro: { select: { nome: true } } },
        },
      },
    }),
    prisma.conversa.count({ where: { pessoaId: { not: null } } }),
  ]);

  const pessoasComCount = pessoas.map((p: any) => ({
    ...p,
    conversaCount: p._count?.conversas || 0,
  }));

  return { pessoas: pessoasComCount, totalConversas };
}

export default async function AdminPessoasPage() {
  const admin = await getAdminFromCookie();
  if (!admin) redirect("/admin/login");
  const data = await getData();

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <nav className="mb-2 text-xs text-gray-500">
            <Link href="/admin/dashboard" className="hover:text-gray-700">Dashboard</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">Pessoas</span>
          </nav>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">Pessoas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Contatos cadastrados pelos cabos eleitorais
          </p>
        </div>
      </div>

      <PessoasClient
        pessoas={data.pessoas as any}
        totalConversas={data.totalConversas}
      />
    </div>
  );
}

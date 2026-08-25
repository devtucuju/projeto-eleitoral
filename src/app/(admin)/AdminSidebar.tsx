"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/pessoas", label: "Pessoas", icon: "🗳️" },
  { href: "/admin/dashboard", label: "Dashboard", icon: "�" },
  { href: "/admin/membros", label: "Membros", icon: "👥" },
  { href: "/admin/missoes", label: "Missões", icon: "🎯" },
  { href: "/admin/celulas", label: "Células", icon: "🏘️" },
  { href: "/admin/candidatos", label: "Candidatos", icon: "🎤" },
  { href: "/admin/partidos", label: "Partidos", icon: "🏛️" },
  { href: "/admin/exportar", label: "Exportar", icon: "⬇️" },
];

export function AdminSidebar({ adminNome, pendentes }: { adminNome: string; pendentes?: number }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile topbar */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 md:hidden dark:border-gray-800 dark:bg-gray-900">
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <path d="M16 3c-5 0-9 4-9 9 0 6.5 9 17 9 17s9-10.5 9-17c0-5-4-9-9-9z" fill="var(--celula-acao)" />
            <circle cx="16" cy="12" r="3.2" fill="white" />
          </svg>
          <span className="font-semibold">scampanha</span>
        </div>
        {pendentes !== undefined && pendentes > 0 && (
          <span className="ml-auto flex h-2 w-2 rounded-full bg-warning-500 animate-pulse" />
        )}
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <aside
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl dark:bg-gray-900"
          >
            <SidebarContent pathname={pathname} adminNome={adminNome} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* Desktop sidebar (md+) */}
      <aside className="sticky top-0 hidden h-screen w-60 flex-shrink-0 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 md:flex md:flex-col">
        <SidebarContent pathname={pathname} adminNome={adminNome} />
      </aside>
    </>
  );
}

function SidebarContent({ pathname, adminNome, onNavigate }: { pathname: string; adminNome: string; onNavigate?: () => void }) {
  return (
    <>
      <div className="border-b border-gray-200 px-5 py-5 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path d="M16 3c-5 0-9 4-9 9 0 6.5 9 17 9 17s9-10.5 9-17c0-5-4-9-9-9z" fill="var(--celula-acao)" />
            <circle cx="16" cy="12" r="3.2" fill="white" />
          </svg>
          <div>
            <div className="text-base font-semibold text-gray-800 dark:text-white/90">scampanha</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-400">Coordenação</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <div className="text-[11px] uppercase tracking-wider text-gray-400">Logado como</div>
        <div className="mb-3 text-sm font-medium text-gray-800 dark:text-white/90">{adminNome}</div>
        <Link
          href="/api/admin/logout"
          className="block w-full rounded-md border border-gray-200 px-3 py-2 text-center text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5"
        >
          Sair
        </Link>
        <Link
          href="/celula/auth"
          className="mt-2 block text-center text-xs text-brand-500 hover:text-brand-600"
        >
          ← App do cabo
        </Link>
      </div>
    </>
  );
}

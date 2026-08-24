"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/celula/home", label: "Home", icon: "home" },
  { href: "/celula/time", label: "Time", icon: "people" },
  { href: "/celula/ajustes", label: "Ajustes", icon: "gear" },
] as const;

function Icon({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? "var(--celula-acao)" : "var(--celula-texto-secundario)";
  const sw = active ? 2.2 : 1.6;
  if (name === "home") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 10.5L12 3l9 7.5V21h-6v-7h-6v7H3z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "people") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="9" r="3" stroke={stroke} strokeWidth={sw} />
        <circle cx="17" cy="10" r="2.2" stroke={stroke} strokeWidth={sw} />
        <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <path d="M15 19c0-2.2 1.8-4 4-4" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={stroke} strokeWidth={sw} />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h0a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
    </svg>
  );
}

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="celula-tabbar" aria-label="Navegação">
      {items.map((it) => {
        const active = pathname?.startsWith(it.href) ?? false;
        return (
          <Link key={it.href} href={it.href} className={`celula-tab-item ${active ? "celula-tab-item-ativo" : ""}`}>
            <Icon name={it.icon} active={active} />
            <span>{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

// Layout do app mobile "Célula"
// Não usa TailAdmin, SidebarContext nem ThemeContext.
// Mobile-first, design system próprio.

import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/motion/Toaster";

export const metadata: Metadata = {
  title: "Célula",
  description: "Conversa → voto confirmado. App para cabo eleitoral.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#F6F4F0",
};

export default function CelulaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="celula-app">
      {children}
      <Toaster />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(() => {});
              });
            }
          `,
        }}
      />
    </div>
  );
}

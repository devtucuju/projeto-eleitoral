import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Layout Three | TailAdmin - Next.js Admin Dashboard Template",
  description: "This is Layout Three for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

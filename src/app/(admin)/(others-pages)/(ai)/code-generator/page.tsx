import { CodeGeneratorWrapper, CodeGeneratorContent } from "@/components/ai";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Next.js AI Code Generator | TailAdmin - Next.js Admin Dashboard Template",
  description:
    "This is Next.js AI Code Generator page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function CodeGeneratorPage() {
  return (
    <div>
      <CodeGeneratorWrapper>
        <CodeGeneratorContent />
      </CodeGeneratorWrapper>
    </div>
  );
}

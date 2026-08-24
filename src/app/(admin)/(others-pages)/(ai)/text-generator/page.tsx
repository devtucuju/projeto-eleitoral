import { TextGeneratorWrapper, TextGeneratorContent } from "@/components/ai";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Next.js AI Text Generator | TailAdmin - Next.js Admin Dashboard Template",
  description:
    "This is AI Next.js Text Generator page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function TextGeneratorPage() {
  return (
    <div>
      <TextGeneratorWrapper>
        <TextGeneratorContent />
      </TextGeneratorWrapper>
    </div>
  );
}

import { ImageGeneratorWrapper, ImageGeneratorContent } from "@/components/ai";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Next.js AI Image Generator | TailAdmin - Next.js Admin Dashboard Template",
  description:
    "This is  Next.js AI Image Generator page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function page() {
  return (
    <div>
      <ImageGeneratorWrapper>
        <ImageGeneratorContent />
      </ImageGeneratorWrapper>
    </div>
  );
}

import { VideoGeneratorWrapper, VideoGeneratorContent } from "@/components/ai";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Next.js AI Video Generator | TailAdmin - Next.js Admin Dashboard Template",
  description:
    "This is Next.js AI Video Generator page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function page() {
  return (
    <div>
      <VideoGeneratorWrapper>
        <VideoGeneratorContent />
      </VideoGeneratorWrapper>
    </div>
  );
}

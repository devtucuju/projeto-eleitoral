"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      closeButton
      duration={3500}
      toastOptions={{
        style: {
          borderRadius: 12,
          fontSize: 15,
          padding: "12px 16px",
        },
        className: "celula-toast",
      }}
    />
  );
}

export { toast } from "sonner";

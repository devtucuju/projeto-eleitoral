"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

function haptic(pattern: number | number[] = 10) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try { navigator.vibrate(pattern); } catch { /* noop */ }
  }
}

const baseStyle: React.CSSProperties = {
  height: 56,
  borderRadius: 14,
  fontSize: 17,
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  border: "none",
  cursor: "pointer",
};

const variants: Record<Variant, React.CSSProperties> = {
  primary: { background: "var(--celula-acao)", color: "white" },
  secondary: { background: "var(--celula-superficie)", color: "var(--celula-texto)", border: "1px solid var(--celula-divisor)" },
  danger: { background: "var(--celula-streak)", color: "white" },
  ghost: { background: "transparent", color: "var(--celula-acao)" },
};

interface Props extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: Variant;
  fullWidth?: boolean;
  hapticPattern?: number | number[];
  children: ReactNode;
}

export const HapticButton = forwardRef<HTMLButtonElement, Props>(function HapticButton(
  { variant = "primary", fullWidth = true, hapticPattern = 10, onClick, style, children, disabled, ...rest },
  ref
) {
  return (
    <motion.button
      ref={ref}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ duration: 0.12 }}
      disabled={disabled}
      onClick={(e) => {
        haptic(hapticPattern);
        onClick?.(e);
      }}
      style={{
        ...baseStyle,
        ...variants[variant],
        width: fullWidth ? "100%" : "auto",
        padding: fullWidth ? "0 16px" : "0 24px",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
      {...rest}
    >
      {children}
    </motion.button>
  );
});

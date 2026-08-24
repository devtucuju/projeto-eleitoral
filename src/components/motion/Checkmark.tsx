"use client";

import { motion } from "framer-motion";

export function Checkmark({ size = 80 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      initial="hidden"
      animate="visible"
    >
      <motion.circle
        cx="40"
        cy="40"
        r="36"
        stroke="var(--celula-acao)"
        strokeWidth="3"
        fill="rgba(31, 107, 74, 0.08)"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 1 },
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      <motion.path
        d="M24 42 L36 54 L58 30"
        stroke="var(--celula-acao)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          hidden: { pathLength: 0 },
          visible: { pathLength: 1 },
        }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

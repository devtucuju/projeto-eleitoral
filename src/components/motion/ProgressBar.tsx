"use client";

import { motion } from "framer-motion";

export function ProgressBar({
  value,
  max = 100,
  color = "var(--celula-acao)",
  className = "",
  showLabel = false,
}: {
  value: number;
  max?: number;
  color?: string;
  className?: string;
  showLabel?: boolean;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`relative h-2 overflow-hidden rounded-full bg-gray-100 ${className}`}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
      {showLabel && (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-gray-600">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const COLORS = ["#1F6B4A", "#C45C26", "#465FFF", "#12B76A", "#FDB022"];

function makeParticle(delay: number, originX: number) {
  const angle = (Math.random() * 60 - 30) * (Math.PI / 180);
  const distance = 80 + Math.random() * 80;
  return {
    id: Math.random(),
    delay,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - 50,
    rotate: Math.random() * 360,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 6 + Math.random() * 6,
  };
}

export function Confetti({ trigger, children }: { trigger: number; children: React.ReactNode }) {
  const [particles, setParticles] = useState<ReturnType<typeof makeParticle>[]>([]);

  useEffect(() => {
    if (trigger === 0) return;
    const list = Array.from({ length: 24 }, (_, i) => makeParticle(i * 0.012, 50));
    setParticles(list);
    const t = setTimeout(() => setParticles([]), 1500);
    return () => clearTimeout(t);
  }, [trigger]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {children}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{ x: p.x, y: p.y, rotate: p.rotate, opacity: 0 }}
            transition={{ duration: 1.2, delay: p.delay, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: p.size,
              height: p.size,
              borderRadius: Math.random() > 0.5 ? "50%" : 2,
              background: p.color,
              pointerEvents: "none",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

import { motion } from "framer-motion";

// Halo difuso (sem borda) — diâmetro grande o suficiente pra cobrir uma
// vizinhança visualmente, tolerando pequenos desvios de posição.
const DIAMETER_RATIO = 4;

export default function CircleHighlight({ centerXPct, centerYPct, sizePct, color = "#14F195" }) {
  const diameterPct = sizePct * DIAMETER_RATIO;
  const rgba = (alpha) => {
    if (color === "#FACC15") return `rgba(250,204,21,${alpha})`;
    return `rgba(20,241,149,${alpha})`;
  };

  return (
    <motion.div
      className="absolute pointer-events-none z-30"
      style={{
        left: `${centerXPct}%`,
        top: `${centerYPct}%`,
        width: `${diameterPct}%`,
        aspectRatio: "1 / 1",
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${rgba(0.7)} 0%, ${rgba(0.35)} 30%, ${rgba(0.0)} 70%)`,
        filter: "blur(10px)",
        mixBlendMode: "screen",
      }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{
        opacity: [0.7, 1, 0.7],
        scale: [1, 1.12, 1],
      }}
      transition={{
        duration: 1.6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

import { motion } from "framer-motion";

// Diâmetro relativo ao tamanho da logo: 3x cobre o grid 3x3 (logo central
// + 8 vizinhas ortogonais e diagonais).
const DIAMETER_RATIO = 3;

export default function CircleHighlight({ centerXPct, centerYPct, sizePct, color = "#14F195" }) {
  // Diameter em % do width do container. aspect-ratio:1 garante círculo
  // perfeito independente do aspect do mosaico.
  const diameterPct = sizePct * DIAMETER_RATIO;
  const colorRgba = (alpha) => {
    if (color === "#14F195") return `rgba(20,241,149,${alpha})`;
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
        border: `2px solid ${color}`,
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: 1,
        scale: 1,
        boxShadow: [
          `0 0 18px 4px ${colorRgba(0.45)}, inset 0 0 12px ${colorRgba(0.2)}`,
          `0 0 40px 10px ${colorRgba(0.85)}, inset 0 0 28px ${colorRgba(0.45)}`,
          `0 0 18px 4px ${colorRgba(0.45)}, inset 0 0 12px ${colorRgba(0.2)}`,
        ],
      }}
      transition={{
        opacity: { duration: 0.4 },
        scale: { duration: 0.5, ease: "easeOut" },
        boxShadow: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
      }}
    />
  );
}

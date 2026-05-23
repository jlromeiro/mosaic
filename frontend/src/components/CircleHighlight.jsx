import { motion } from "framer-motion";

// Halo difuso + anéis orbitando — diâmetro grande tolerante a pequenos
// desvios. Toda a geometria fica em % do container externo, então o
// efeito escala em qualquer viewport.
const DIAMETER_RATIO = 4.5;

export default function CircleHighlight({ centerXPct, centerYPct, sizePct, color = "#14F195" }) {
  const diameterPct = sizePct * DIAMETER_RATIO;

  const rgba = (alpha) => {
    if (color === "#FACC15") return `rgba(250,204,21,${alpha})`;
    return `rgba(20,241,149,${alpha})`;
  };

  return (
    <div
      className="absolute pointer-events-none z-30"
      style={{
        left: `${centerXPct}%`,
        top: `${centerYPct}%`,
        width: `${diameterPct}%`,
        aspectRatio: "1 / 1",
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Halo principal — radial gradient intenso, pulsa em opacity + scale */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${rgba(0.95)} 0%, ${rgba(0.65)} 22%, ${rgba(0.3)} 50%, ${rgba(0)} 78%)`,
          filter: "blur(8px)",
          mixBlendMode: "screen",
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{
          opacity: [0.85, 1, 0.85],
          scale: [1, 1.18, 1],
        }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Anel orbital externo (horário) — sweep de luz girando */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: "18%",
          background: `conic-gradient(from 0deg, ${rgba(0)} 0deg, ${rgba(0.95)} 30deg, ${rgba(0)} 90deg, ${rgba(0)} 180deg, ${rgba(0.75)} 210deg, ${rgba(0)} 270deg)`,
          WebkitMask:
            "radial-gradient(circle, transparent 60%, black 66%, black 88%, transparent 96%)",
          mask:
            "radial-gradient(circle, transparent 60%, black 66%, black 88%, transparent 96%)",
          filter: "blur(2px)",
          mixBlendMode: "screen",
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Anel orbital interno (anti-horário, mais devagar) — profundidade */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: "28%",
          background: `conic-gradient(from 180deg, ${rgba(0)} 0deg, ${rgba(0.7)} 50deg, ${rgba(0)} 120deg, ${rgba(0)} 360deg)`,
          WebkitMask:
            "radial-gradient(circle, transparent 55%, black 62%, black 85%, transparent 95%)",
          mask:
            "radial-gradient(circle, transparent 55%, black 62%, black 85%, transparent 95%)",
          filter: "blur(1.5px)",
          mixBlendMode: "screen",
          opacity: 0.85,
        }}
        animate={{ rotate: -360 }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

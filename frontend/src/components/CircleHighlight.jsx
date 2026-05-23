import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

// Halo difuso + anéis orbitando — diâmetro grande tolerante a desvios.
const DIAMETER_RATIO = 4.5;

export default function CircleHighlight({
  centerXPct,
  centerYPct,
  sizePct,
  color = "#14F195",
  dismissed = false,
  onDismiss,
}) {
  const diameterPct = sizePct * DIAMETER_RATIO;

  const rgba = (alpha) => {
    if (color === "#FACC15") return `rgba(250,204,21,${alpha})`;
    return `rgba(20,241,149,${alpha})`;
  };

  return (
    <div
      className="absolute z-30"
      style={{
        left: `${centerXPct}%`,
        top: `${centerYPct}%`,
        width: `${diameterPct}%`,
        aspectRatio: "1 / 1",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
    >
      <AnimatePresence>
        {!dismissed && (
          <>
            <motion.div
              key="halo"
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, ${rgba(0.95)} 0%, ${rgba(0.65)} 22%, ${rgba(0.3)} 50%, ${rgba(0)} 78%)`,
                filter: "blur(8px)",
                mixBlendMode: "screen",
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0.85, 1, 0.85], scale: [1, 1.18, 1] }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              key="ring-outer"
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                opacity: { duration: 0.4 },
              }}
            />

            <motion.div
              key="ring-inner"
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
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85, rotate: -360 }}
              exit={{ opacity: 0 }}
              transition={{
                rotate: { duration: 4.5, repeat: Infinity, ease: "linear" },
                opacity: { duration: 0.4 },
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Lupa clicável — sempre visível. Antes de clicar: pulsa convidando
          a ação. Depois de clicar: marker discreto, halo desligado. */}
      <motion.button
        type="button"
        onClick={onDismiss}
        aria-label={dismissed ? "Your project location" : "Dismiss highlight"}
        className="absolute left-1/2 top-1/2 flex items-center justify-center rounded-full
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary"
        style={{
          width: "22%",
          aspectRatio: "1 / 1",
          transform: "translate(-50%, -50%)",
          background: dismissed ? rgba(0.18) : rgba(0.32),
          border: `2px solid ${dismissed ? rgba(0.55) : rgba(0.95)}`,
          boxShadow: dismissed
            ? `0 0 10px ${rgba(0.35)}, inset 0 0 6px ${rgba(0.25)}`
            : `0 0 22px ${rgba(0.75)}, inset 0 0 10px ${rgba(0.5)}`,
          color,
          backdropFilter: "blur(2px)",
          cursor: "pointer",
          pointerEvents: "auto",
        }}
        animate={
          dismissed
            ? { scale: 1, opacity: 0.85 }
            : { scale: [1, 1.12, 1], opacity: 1 }
        }
        whileHover={{ scale: dismissed ? 1.08 : 1.15 }}
        whileTap={{ scale: 0.92 }}
        transition={{
          scale: dismissed
            ? { duration: 0.3 }
            : { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Search className="w-1/2 h-1/2" strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}

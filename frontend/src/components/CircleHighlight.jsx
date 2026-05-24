import { motion } from "framer-motion";

// Halo difuso + anéis orbitando — diâmetro grande tolerante a pequenos
// desvios. Toda a geometria fica em % do container externo, então o
// efeito escala em qualquer viewport.
const DIAMETER_RATIO = 4.5;
// Floor mínimo em % do container — garante visibilidade em mobile (onde
// o container ~325px x sizePct ~1.6% daria ~23px sem o floor). Em desktop
// o cálculo natural já passa de 16% e o floor não tem efeito.
const MIN_DIAMETER_PCT = 16;

export default function CircleHighlight({
  centerXPct,
  centerYPct,
  sizePct,
  color = "#14F195",
  softened = false,
}) {
  const diameterPct = Math.max(sizePct * DIAMETER_RATIO, MIN_DIAMETER_PCT);

  const rgba = (alpha) => {
    if (color === "#FACC15") return `rgba(250,204,21,${alpha})`;
    return `rgba(20,241,149,${alpha})`;
  };

  // Em modo softened (após clique do usuário) os anéis somem e o halo
  // central fica em alpha bem reduzido + pulsação 3x mais lenta. Mantém
  // só uma marca discreta da posição até o efeito cessar.
  const haloAlpha = softened
    ? { peak: 0.35, mid: 0.18, glow: 0.05 }
    : { peak: 0.95, mid: 0.65, glow: 0.30 };
  const haloDuration = softened ? 4.2 : 1.4;
  const haloOpacityRange = softened ? [0.5, 0.7, 0.5] : [0.85, 1, 0.85];
  const haloScaleRange = softened ? [1, 1.05, 1] : [1, 1.18, 1];

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
      {/* Halo principal — radial gradient. Em modo softened fica mais
          tênue e pulsa mais lento. */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${rgba(haloAlpha.peak)} 0%, ${rgba(haloAlpha.mid)} 22%, ${rgba(haloAlpha.glow)} 50%, ${rgba(0)} 78%)`,
          filter: "blur(8px)",
          mixBlendMode: "screen",
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: haloOpacityRange, scale: haloScaleRange }}
        transition={{
          duration: haloDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Anéis orbitais — só renderizam quando NÃO está softened. Após o
          clique, somem com fade-out via AnimatePresence-like behavior
          (opacity transition no exit do parent). */}
      {!softened && (
        <>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              opacity: { duration: 0.4 },
            }}
          />

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
    </div>
  );
}

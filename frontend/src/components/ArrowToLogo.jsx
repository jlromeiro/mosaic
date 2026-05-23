import { motion } from "framer-motion";

function pickDirection(centerXPct, centerYPct) {
  const distTop = centerYPct;
  const distBottom = 100 - centerYPct;
  const distLeft = centerXPct;
  const distRight = 100 - centerXPct;
  const max = Math.max(distTop, distBottom, distLeft, distRight);
  if (max === distTop) return "top";
  if (max === distBottom) return "bottom";
  if (max === distLeft) return "left";
  return "right";
}

export default function ArrowToLogo({ centerXPct, centerYPct }) {
  const direction = pickDirection(centerXPct, centerYPct);

  // Offset pequeno (3%) — a logo ocupa ~1.5% do mosaico, a seta aponta
  // bem próxima sem cobrir.
  const config = {
    top: {
      style: { left: `${centerXPct}%`, top: `${Math.max(centerYPct - 3, 0)}%`, transform: "translate(-50%, -100%)" },
      bounce: { y: [0, 6, 0] },
      rotate: 180,
    },
    bottom: {
      style: { left: `${centerXPct}%`, top: `${Math.min(centerYPct + 3, 100)}%`, transform: "translate(-50%, 0)" },
      bounce: { y: [0, -6, 0] },
      rotate: 0,
    },
    left: {
      style: { left: `${Math.max(centerXPct - 3, 0)}%`, top: `${centerYPct}%`, transform: "translate(-100%, -50%)" },
      bounce: { x: [0, 6, 0] },
      rotate: 90,
    },
    right: {
      style: { left: `${Math.min(centerXPct + 3, 100)}%`, top: `${centerYPct}%`, transform: "translate(0, -50%)" },
      bounce: { x: [0, -6, 0] },
      rotate: -90,
    },
  }[direction];

  return (
    <motion.div
      className="absolute pointer-events-none z-30"
      style={config.style}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.div
        animate={config.bounce}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 64 64"
          style={{
            transform: `rotate(${config.rotate}deg)`,
            filter: "drop-shadow(0 0 14px rgba(20,241,149,0.95))",
          }}
        >
          <defs>
            <linearGradient id="arrowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00D4FF" />
              <stop offset="100%" stopColor="#14F195" />
            </linearGradient>
          </defs>
          <path
            d="M32 4 L32 50 M32 50 L18 36 M32 50 L46 36"
            stroke="url(#arrowGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

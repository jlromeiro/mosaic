import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CircleHighlight from "./CircleHighlight";

const MOSAIC_SRC = "/mosaic.jpg";
const ASPECT = "4096 / 3948";
const APPROX_THRESHOLD = 0.45;
const ZOOM_SCALE = 1.6;
const ZOOM_EASE = [0.22, 1, 0.36, 1];
// Tempo entre o clique e o sumiço completo do halo.
const FADE_OUT_AFTER_DISMISS_MS = 3000;

export default function MosaicViewer({ match }) {
  // dismissed: usuário clicou — zoom volta a 1x e halo entra em modo softened.
  // hidden: passaram 3s do dismissed — halo some por completo.
  const [dismissed, setDismissed] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Reset sempre que houver um novo match (ou hover preview de outra posição).
  useEffect(() => {
    setDismissed(false);
    setHidden(false);
  }, [match?.position?.centerX, match?.position?.centerY]);

  // 3s após o dismiss, esconder o halo completamente.
  useEffect(() => {
    if (!dismissed) return;
    const t = setTimeout(() => setHidden(true), FADE_OUT_AFTER_DISMISS_MS);
    return () => clearTimeout(t);
  }, [dismissed]);

  let circleProps = null;
  let zoomTransform = { scale: 1, x: 0, y: 0 };
  let zoomed = false;

  if (match && match.position && match.mosaic) {
    const { width: mw, height: mh } = match.mosaic;
    const cxPct = (match.position.centerX / mw) * 100;
    const cyPct = (match.position.centerY / mh) * 100;
    const sizePct = (match.position.width / mw) * 100;
    const isApprox = !match.found || (match.confidence ?? 0) < APPROX_THRESHOLD;

    circleProps = {
      centerXPct: cxPct,
      centerYPct: cyPct,
      sizePct,
      color: isApprox ? "#FACC15" : "#14F195",
      softened: dismissed,
    };

    // Zoom só enquanto não dismissed. Após clique, volta pra 1x.
    if (!dismissed) {
      zoomTransform = {
        scale: ZOOM_SCALE,
        x: `${(50 - cxPct) * ZOOM_SCALE}%`,
        y: `${(50 - cyPct) * ZOOM_SCALE}%`,
      };
      zoomed = true;
    }
  }

  const interactive = zoomed && !dismissed;

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden bg-bg-secondary border border-border-subtle ${interactive ? "cursor-pointer" : ""}`}
      style={{ aspectRatio: ASPECT }}
      onClick={() => interactive && setDismissed(true)}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(e) => {
        if (interactive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          setDismissed(true);
        }
      }}
      aria-label={interactive ? "Click to zoom out and dismiss highlight" : undefined}
    >
      <motion.div
        className="absolute inset-0"
        animate={zoomTransform}
        transition={{
          duration: zoomed ? 1.2 : 0.9,
          delay: zoomed ? 0.2 : 0,
          ease: ZOOM_EASE,
        }}
        style={{ transformOrigin: "center center" }}
      >
        <img
          src={MOSAIC_SRC}
          alt="Solana Hackathon Mosaic"
          className="absolute inset-0 w-full h-full select-none"
          style={{ objectFit: "fill" }}
          draggable={false}
        />
        <AnimatePresence>
          {circleProps && !hidden && (
            <motion.div
              key="highlight-layer"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <CircleHighlight {...circleProps} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

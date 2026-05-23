import { useRef } from "react";
import { motion } from "framer-motion";
import PulsingHighlight from "./PulsingHighlight";
import ArrowToLogo from "./ArrowToLogo";

const MOSAIC_SRC = "/mosaic.jpg";

export default function MosaicViewer({ match }) {
  const containerRef = useRef(null);

  let highlightProps = null;
  let arrowProps = null;
  let zoomTransform = { scale: 1, x: 0, y: 0 };

  // Coordenadas vêm do backend já na escala do mosaico full (4096x3948).
  // O <img> renderiza a versão web (2048x1974), mas object-cover preserva
  // a proporção, então converter por ratio funciona em qualquer resolução
  // do <img> exibida.
  if (match && match.found && match.mosaic) {
    const { width: mw, height: mh } = match.mosaic;
    const xPct = (match.position.x / mw) * 100;
    const yPct = (match.position.y / mh) * 100;
    const wPct = (match.position.width / mw) * 100;
    const hPct = (match.position.height / mh) * 100;
    const cxPct = (match.position.centerX / mw) * 100;
    const cyPct = (match.position.centerY / mh) * 100;

    highlightProps = { x: xPct, y: yPct, width: wPct, height: hPct };
    arrowProps = { centerXPct: cxPct, centerYPct: cyPct };

    const targetScale = 2.2;
    zoomTransform = {
      scale: targetScale,
      x: (50 - cxPct) * targetScale,
      y: (50 - cyPct) * targetScale,
    };
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square rounded-2xl overflow-hidden bg-bg-secondary border border-border-subtle"
    >
      <motion.div
        className="absolute inset-0"
        animate={zoomTransform}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "center center" }}
      >
        <img
          src={MOSAIC_SRC}
          alt="Solana Hackathon Mosaic"
          className="w-full h-full object-cover select-none"
          draggable={false}
        />
        {highlightProps && <PulsingHighlight {...highlightProps} />}
      </motion.div>
      {arrowProps && <ArrowToLogo {...arrowProps} />}
    </div>
  );
}

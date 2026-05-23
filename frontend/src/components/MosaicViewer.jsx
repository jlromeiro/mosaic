import { useRef } from "react";
import { motion } from "framer-motion";
import PulsingHighlight from "./PulsingHighlight";
import ArrowToLogo from "./ArrowToLogo";

const MOSAIC_SRC = "/mosaic.jpg";
// Zoom calibrado pra dar contexto: ~37% do mosaico em cada eixo visível.
// Em mosaico 4096x3948 com células ~33px, isso são ~45-55 logos vizinhas
// visíveis em volta da encontrada. Suficiente pra "ambiente".
const ZOOM_SCALE = 1.6;

export default function MosaicViewer({ match }) {
  const containerRef = useRef(null);

  let highlightProps = null;
  let arrowProps = null;
  let zoomTransform = { scale: 1, x: 0, y: 0 };
  let zoomed = false;

  if (match && match.found && match.mosaic) {
    const { width: mw, height: mh } = match.mosaic;
    const xPct = (match.position.x / mw) * 100;
    const yPct = (match.position.y / mh) * 100;
    const wPct = (match.position.width / mw) * 100;
    const hPct = (match.position.height / mh) * 100;
    const cxPct = (match.position.centerX / mw) * 100;
    const cyPct = (match.position.centerY / mh) * 100;

    highlightProps = { x: xPct, y: yPct, width: wPct, height: hPct };
    arrowProps = { centerXPct: cxPct, centerYPct: cyPct, counterScale: 1 / ZOOM_SCALE };

    zoomTransform = {
      scale: ZOOM_SCALE,
      x: (50 - cxPct) * ZOOM_SCALE,
      y: (50 - cyPct) * ZOOM_SCALE,
    };
    zoomed = true;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square rounded-2xl overflow-hidden bg-bg-secondary border border-border-subtle"
    >
      <motion.div
        className="absolute inset-0"
        animate={zoomTransform}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "center center" }}
      >
        <img
          src={MOSAIC_SRC}
          alt="Solana Hackathon Mosaic"
          className="w-full h-full object-cover select-none"
          draggable={false}
        />
        {highlightProps && <PulsingHighlight {...highlightProps} />}
        {arrowProps && <ArrowToLogo {...arrowProps} />}
      </motion.div>
    </div>
  );
}

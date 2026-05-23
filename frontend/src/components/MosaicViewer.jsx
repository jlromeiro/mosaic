import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import PulsingHighlight from "./PulsingHighlight";
import ArrowToLogo from "./ArrowToLogo";

const MOSAIC_SRC = "/mosaic.jpg";

export default function MosaicViewer({ match }) {
  const containerRef = useRef(null);
  const [naturalSize, setNaturalSize] = useState(null);

  const handleLoad = (e) => {
    setNaturalSize({ w: e.target.naturalWidth, h: e.target.naturalHeight });
  };

  let highlightProps = null;
  let arrowProps = null;
  let zoomTransform = { scale: 1, x: 0, y: 0 };

  if (match && match.found && naturalSize) {
    const xPct = (match.position.x / naturalSize.w) * 100;
    const yPct = (match.position.y / naturalSize.h) * 100;
    const wPct = (match.position.width / naturalSize.w) * 100;
    const hPct = (match.position.height / naturalSize.h) * 100;
    const cxPct = (match.position.centerX / naturalSize.w) * 100;
    const cyPct = (match.position.centerY / naturalSize.h) * 100;

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
          onLoad={handleLoad}
          className="w-full h-full object-cover select-none"
          draggable={false}
        />
        {highlightProps && <PulsingHighlight {...highlightProps} />}
      </motion.div>
      {arrowProps && <ArrowToLogo {...arrowProps} />}
    </div>
  );
}

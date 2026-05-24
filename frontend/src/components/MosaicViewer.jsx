import { motion } from "framer-motion";
import CircleHighlight from "./CircleHighlight";

const MOSAIC_SRC = "/mosaic.jpg";
// Aspect-ratio do mosaico fonte (4096x3948 ~ 1.0375). Casar exato com o
// container elimina o crop do object-cover — sem isso, as % de posição
// do mosaico não correspondem 1:1 às % do container exibido.
const ASPECT = "4096 / 3948";
const APPROX_THRESHOLD = 0.45;

// Zoom discreto após match — mostra a logo + grade de ~30 ícones vizinhos.
// 1.6x cobre ~62% do mosaico em cada eixo: o suficiente pra dar destaque
// sem isolar a logo do contexto. Easing cubic-bezier suaviza a transição.
const ZOOM_SCALE = 1.6;
const ZOOM_EASE = [0.22, 1, 0.36, 1];

export default function MosaicViewer({ match }) {
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
    };

    // Pan: leva o ponto (cxPct, cyPct) do mosaico pro centro (50%, 50%) da
    // viewport DEPOIS do scale. x/y em framer-motion são pixels — usamos %
    // do container (Framer aceita strings com unidade).
    zoomTransform = {
      scale: ZOOM_SCALE,
      x: `${(50 - cxPct) * ZOOM_SCALE}%`,
      y: `${(50 - cyPct) * ZOOM_SCALE}%`,
    };
    zoomed = true;
  }

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden bg-bg-secondary border border-border-subtle"
      style={{ aspectRatio: ASPECT }}
    >
      <motion.div
        className="absolute inset-0"
        animate={zoomTransform}
        transition={{
          duration: zoomed ? 1.2 : 0.8,
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
        {circleProps && <CircleHighlight {...circleProps} />}
      </motion.div>
    </div>
  );
}

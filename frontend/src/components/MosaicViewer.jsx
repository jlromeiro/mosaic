import { useEffect, useState } from "react";
import CircleHighlight from "./CircleHighlight";

const MOSAIC_SRC = "/mosaic.jpg";
const ASPECT = "4096 / 3948";
const APPROX_THRESHOLD = 0.45;

export default function MosaicViewer({ match }) {
  const [dismissed, setDismissed] = useState(false);

  // Reset dismissal sempre que houver um novo match (ou hover preview novo).
  useEffect(() => {
    setDismissed(false);
  }, [match?.position?.centerX, match?.position?.centerY]);

  let circleProps = null;
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
      dismissed,
      onDismiss: () => setDismissed(true),
    };
  }

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden bg-bg-secondary border border-border-subtle"
      style={{ aspectRatio: ASPECT }}
    >
      <img
        src={MOSAIC_SRC}
        alt="Solana Hackathon Mosaic"
        className="absolute inset-0 w-full h-full select-none"
        style={{ objectFit: "fill" }}
        draggable={false}
      />
      {circleProps && <CircleHighlight {...circleProps} />}
    </div>
  );
}

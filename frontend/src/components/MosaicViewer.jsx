import ArrowToLogo from "./ArrowToLogo";

const MOSAIC_SRC = "/mosaic.jpg";
// Aspect-ratio do mosaico fonte (4096x3948 ~ 1.0375). Casar exato com o
// container elimina o crop do object-cover — sem isso, as % de posição
// do mosaico não correspondem 1:1 às % do container exibido.
const ASPECT = "4096 / 3948";

export default function MosaicViewer({ match }) {
  let arrowProps = null;

  if (match && match.found && match.mosaic) {
    const { width: mw, height: mh } = match.mosaic;
    const cxPct = (match.position.centerX / mw) * 100;
    const cyPct = (match.position.centerY / mh) * 100;
    arrowProps = { centerXPct: cxPct, centerYPct: cyPct };
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
      {arrowProps && <ArrowToLogo {...arrowProps} />}
    </div>
  );
}

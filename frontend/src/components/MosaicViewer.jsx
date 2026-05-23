import ArrowToLogo from "./ArrowToLogo";

const MOSAIC_SRC = "/mosaic.jpg";

export default function MosaicViewer({ match }) {
  let arrowProps = null;

  if (match && match.found && match.mosaic) {
    const { width: mw, height: mh } = match.mosaic;
    const cxPct = (match.position.centerX / mw) * 100;
    const cyPct = (match.position.centerY / mh) * 100;
    arrowProps = { centerXPct: cxPct, centerYPct: cyPct };
  }

  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-bg-secondary border border-border-subtle">
      <img
        src={MOSAIC_SRC}
        alt="Solana Hackathon Mosaic"
        className="absolute inset-0 w-full h-full object-cover select-none"
        draggable={false}
      />
      {arrowProps && <ArrowToLogo {...arrowProps} />}
    </div>
  );
}

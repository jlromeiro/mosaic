import { motion } from "framer-motion";
import { Download, RotateCcw, MapPin, HelpCircle } from "lucide-react";

const MOSAIC_SRC = "/mosaic.jpg";
// Threshold único: acima de 65% mostramos como match válido ("Found!");
// abaixo, "Approximated" pedindo logo mais clara. Removido o tier ciano
// intermediário que estava marcando confidence em torno de 70% como
// "Match confidence is moderate" — confundia usuários com match razoável.
const CONFIDENT_THRESHOLD = 0.65;

export default function ZoomCard({ match, userUploadUrl, onReset, onConfirm }) {
  if (!match || !match.position) return null;

  const { position, mosaic, confidence, elapsed_ms, found } = match;
  const zoomScale = 6;
  const isConfident = found && confidence >= CONFIDENT_THRESHOLD;
  const isApprox = !isConfident;

  // Posicionamento em % do container (independente do tamanho exibido).
  // Centro do mosaico no zoom é o centro da logo encontrada.
  const cxPct = (position.centerX / mosaic.width) * 100;
  const cyPct = (position.centerY / mosaic.height) * 100;
  const xPct = (position.x / mosaic.width) * 100;
  const yPct = (position.y / mosaic.height) * 100;
  const wPct = (position.width / mosaic.width) * 100;
  const hPct = (position.height / mosaic.height) * 100;

  // Pra que o ponto centerXPct do mosaico zoomado caia no 50% do
  // container: left do div ampliado = 50% - centerXPct * zoomScale%.
  const bgLeftPct = 50 - cxPct * zoomScale;
  const bgTopPct = 50 - cyPct * zoomScale;

  const handleDownload = async () => {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = MOSAIC_SRC;
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });

      const cropPad = Math.max(position.width, position.height) * 6;
      const renderScale = img.naturalWidth / mosaic.width;
      const rPx = (n) => n * renderScale;

      const cropX = Math.max(0, rPx(position.centerX - cropPad / 2));
      const cropY = Math.max(0, rPx(position.centerY - cropPad / 2));
      const cropW = Math.min(img.naturalWidth - cropX, rPx(cropPad));
      const cropH = Math.min(img.naturalHeight - cropY, rPx(cropPad));

      const canvas = document.createElement("canvas");
      canvas.width = cropW;
      canvas.height = cropH;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

      const rx = rPx(position.x) - cropX;
      const ry = rPx(position.y) - cropY;
      const rw = rPx(position.width);
      const rh = rPx(position.height);
      ctx.strokeStyle = "#14F195";
      ctx.lineWidth = 6;
      ctx.shadowColor = "#14F195";
      ctx.shadowBlur = 24;
      ctx.strokeRect(rx, ry, rw, rh);

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-logo-in-the-mosaic.png";
      a.click();
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  // 2 tiers: confiante (verde) · aproximado (amarelo). O ciano intermediário
  // foi removido porque "Match confidence is moderate" em ~70% era confuso.
  const tier = isConfident
    ? {
        Icon: MapPin,
        title: "Found! Your project is here.",
        color: "text-solana-green",
        pill: "bg-solana-green/15 text-solana-green",
      }
    : {
        Icon: HelpCircle,
        title: "Approximated match",
        color: "text-yellow-400",
        pill: "bg-yellow-400/15 text-yellow-400",
      };

  const TierIcon = tier.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="solana-gradient-border rounded-2xl p-5 space-y-4"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TierIcon className={`w-4 h-4 ${tier.color} shrink-0`} />
          <span className="text-sm font-semibold text-text-primary">{tier.title}</span>
        </div>
        <span className={`text-xs font-mono px-2 py-1 rounded-md ${tier.pill}`}>
          {(confidence * 100).toFixed(0)}%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-wider text-text-tertiary px-0.5">
            Your upload
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden bg-bg-secondary border border-border-subtle">
            {userUploadUrl ? (
              <img
                src={userUploadUrl}
                alt="your upload"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-tertiary text-xs">
                preview unavailable
              </div>
            )}
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-wider text-text-tertiary px-0.5">
            {isApprox ? "Closest match found" : "What we found"}
          </div>
          <div
            className="relative rounded-lg overflow-hidden bg-bg-secondary border border-border-subtle"
            style={{ aspectRatio: `${mosaic.width} / ${mosaic.height}` }}
          >
            <div
              className="absolute"
              style={{
                left: `${bgLeftPct}%`,
                top: `${bgTopPct}%`,
                width: `${100 * zoomScale}%`,
                height: `${100 * zoomScale}%`,
                backgroundImage: `url(${MOSAIC_SRC})`,
                backgroundSize: "100% 100%",
              }}
            >
              <div
                className="absolute pointer-events-none"
                style={{
                  left: `${xPct}%`,
                  top: `${yPct}%`,
                  width: `${wPct}%`,
                  height: `${hPct}%`,
                  border: `3px solid ${isApprox ? "#FACC15" : "#14F195"}`,
                  borderRadius: "4px",
                  boxShadow: isApprox
                    ? "0 0 24px rgba(250,204,21,0.6), inset 0 0 12px rgba(250,204,21,0.3)"
                    : "0 0 24px rgba(20,241,149,0.7), inset 0 0 12px rgba(20,241,149,0.3)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-text-tertiary">
        <span>position {position.x},{position.y}</span>
        <span>{elapsed_ms}ms</span>
      </div>

      {(match.method || match.margin !== undefined) && (
        <div className="flex items-center justify-between text-[10px] text-text-tertiary font-mono">
          {match.method && <span>method · {match.method}</span>}
          {match.margin !== undefined && (
            <span title="confidence gap to second best match (higher = less ambiguous)">
              margin · {(match.margin * 100).toFixed(0)}%
            </span>
          )}
        </div>
      )}

      {isApprox && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-text-secondary bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-3"
        >
          Try a clearer crop of your original logo (same version, same colors). Avoid photos and
          screenshots.
        </motion.div>
      )}

      <div className="flex gap-2">
        {isConfident && (
          <button
            onClick={handleDownload}
            className="flex-1 py-2.5 rounded-lg bg-bg-tertiary hover:bg-border-emphasis text-text-primary text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        )}
        <button
          onClick={onReset}
          className="flex-1 py-2.5 rounded-lg border border-border-emphasis hover:border-solana-green/50 text-text-secondary hover:text-solana-green text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Try again
        </button>
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { Download, RotateCcw, MapPin, AlertTriangle, Check, HelpCircle } from "lucide-react";

const MOSAIC_SRC = "/mosaic.jpg";
const HIGH_CONFIDENCE = 0.80;
const FOUND_THRESHOLD = 0.45;

export default function ZoomCard({ match, userUploadUrl, onReset, onConfirm }) {
  if (!match || !match.position) return null;

  const { position, mosaic, confidence, elapsed_ms, found } = match;
  const zoomScale = 6;
  const isHigh = confidence >= HIGH_CONFIDENCE;
  const isApprox = !found || confidence < FOUND_THRESHOLD;

  const left = -(position.x - position.width * 6) * zoomScale;
  const top = -(position.y - position.height * 6) * zoomScale;

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

  // Tier visual: high (verde) · medium (ciano) · approximated (amarelo)
  let tier;
  if (isHigh) {
    tier = {
      Icon: MapPin,
      title: "Found! Your project is here.",
      color: "text-solana-green",
      pill: "bg-solana-green/15 text-solana-green",
      border: "border-solana-green/40",
    };
  } else if (!isApprox) {
    tier = {
      Icon: AlertTriangle,
      title: "We think it's here.",
      color: "text-solana-cyan",
      pill: "bg-solana-cyan/15 text-solana-cyan",
      border: "border-solana-cyan/40",
    };
  } else {
    tier = {
      Icon: HelpCircle,
      title: "Approximated match",
      color: "text-yellow-400",
      pill: "bg-yellow-400/15 text-yellow-400",
      border: "border-yellow-400/40",
    };
  }

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
          <div className="relative aspect-square rounded-lg overflow-hidden bg-bg-secondary border border-border-subtle">
            <div
              className="absolute"
              style={{
                left: `${left}px`,
                top: `${top}px`,
                width: `${mosaic.width * zoomScale}px`,
                height: `${mosaic.height * zoomScale}px`,
                backgroundImage: `url(${MOSAIC_SRC})`,
                backgroundSize: "100% 100%",
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                left: "50%",
                top: "50%",
                width: `${position.width * zoomScale}px`,
                height: `${position.height * zoomScale}px`,
                transform: "translate(-50%, -50%)",
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

      <div className="flex items-center justify-between text-xs text-text-tertiary">
        <span>position {position.x},{position.y}</span>
        <span>{elapsed_ms}ms</span>
      </div>

      {isApprox && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-text-secondary bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-3"
        >
          <span className="font-semibold text-yellow-400">
            {(confidence * 100).toFixed(0)}% similarity
          </span>{" "}
          to what's in the mosaic — likely not a confident match. Compare both images and try a
          clearer crop of your logo (same version, same colors).
        </motion.div>
      )}

      {!isHigh && !isApprox && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-text-secondary bg-solana-cyan/10 border border-solana-cyan/30 rounded-lg p-3"
        >
          Match confidence is moderate. Compare both images — if it doesn't look right, try
          uploading a clearer crop.
        </motion.div>
      )}

      <div className="flex gap-2">
        {!isHigh && !isApprox && onConfirm && (
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg bg-solana-green/15 hover:bg-solana-green/25 border border-solana-green/40 text-solana-green text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Check className="w-4 h-4" />
            That's mine
          </button>
        )}
        {!isApprox && (
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

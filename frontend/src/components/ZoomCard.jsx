import { motion } from "framer-motion";
import { Download, RotateCcw, MapPin } from "lucide-react";

const MOSAIC_SRC = "/mosaic.jpg";

export default function ZoomCard({ match, onReset }) {
  if (!match || !match.found) return null;

  const { position, mosaic, confidence, elapsed_ms } = match;
  const padding = 6;
  const zoomScale = 6;

  const left = -(position.x - position.width * padding) * zoomScale;
  const top = -(position.y - position.height * padding) * zoomScale;
  const viewSize = position.width * (1 + padding * 2) * zoomScale;

  const handleDownload = async () => {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = MOSAIC_SRC;
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });

      const canvas = document.createElement("canvas");
      const cropPad = Math.max(position.width, position.height) * 6;
      const cropX = Math.max(0, position.centerX - cropPad / 2);
      const cropY = Math.max(0, position.centerY - cropPad / 2);
      const cropW = Math.min(mosaic.width - cropX, cropPad);
      const cropH = Math.min(mosaic.height - cropY, cropPad);

      canvas.width = cropW;
      canvas.height = cropH;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

      const rx = position.x - cropX;
      const ry = position.y - cropY;
      ctx.strokeStyle = "#14F195";
      ctx.lineWidth = 6;
      ctx.shadowColor = "#14F195";
      ctx.shadowBlur = 24;
      ctx.strokeRect(rx, ry, position.width, position.height);

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-logo-in-the-mosaic.png";
      a.click();
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="solana-gradient-border rounded-2xl p-5 space-y-4"
    >
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-solana-green" />
        <span className="text-sm font-semibold text-text-primary">
          Found! Your project is here.
        </span>
      </div>

      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-bg-secondary border border-border-subtle">
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
            border: "3px solid #14F195",
            borderRadius: "4px",
            boxShadow: "0 0 24px rgba(20,241,149,0.7), inset 0 0 12px rgba(20,241,149,0.3)",
          }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-text-tertiary">
        <span>confidence {(confidence * 100).toFixed(1)}%</span>
        <span>{elapsed_ms}ms</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          className="flex-1 py-2.5 rounded-lg bg-bg-tertiary hover:bg-border-emphasis text-text-primary text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
        <button
          onClick={onReset}
          className="flex-1 py-2.5 rounded-lg border border-border-emphasis hover:border-solana-green/50 text-text-secondary hover:text-solana-green text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          New search
        </button>
      </div>
    </motion.div>
  );
}

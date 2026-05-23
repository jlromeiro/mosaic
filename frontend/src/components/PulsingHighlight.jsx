import { motion } from "framer-motion";

export default function PulsingHighlight({ x, y, width, height, padding = 6 }) {
  const px = x - padding;
  const py = y - padding;
  const pw = width + padding * 2;
  const ph = height + padding * 2;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${px}%`, top: `${py}%`, width: `${pw}%`, height: `${ph}%` }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="absolute inset-0 rounded-md border-2 border-solana-green"
        animate={{
          boxShadow: [
            "0 0 12px 2px rgba(20,241,149,0.6), inset 0 0 8px rgba(20,241,149,0.3)",
            "0 0 28px 6px rgba(20,241,149,0.95), inset 0 0 18px rgba(20,241,149,0.6)",
            "0 0 12px 2px rgba(20,241,149,0.6), inset 0 0 8px rgba(20,241,149,0.3)",
          ],
        }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

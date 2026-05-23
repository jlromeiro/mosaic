import { motion } from "framer-motion";
import StatsCounter from "./StatsCounter";

export default function Hero({ statsRefreshKey }) {
  return (
    <section className="relative z-10 px-6 md:px-12 pt-10 md:pt-16 pb-8">
      <div className="max-w-container mx-auto text-center space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-solana-purple/10 border border-solana-purple/30 text-solana-purple text-xs font-medium"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-solana-purple animate-pulse" />
          Solana Hackathon · 2026
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
        >
          Find your logo in the{" "}
          <span className="solana-gradient-text">Solana Hackathon Mosaic</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto"
        >
          Upload a crop of your project logo and instantly discover where it appears.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-2"
        >
          <StatsCounter refreshKey={statsRefreshKey} />
        </motion.div>
      </div>
    </section>
  );
}

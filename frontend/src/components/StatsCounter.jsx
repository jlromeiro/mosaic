import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getStats } from "../lib/api";

export default function StatsCounter({ refreshKey }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    getStats()
      .then((data) => {
        if (alive) setStats(data);
      })
      .catch(() => {
        if (alive) setError(true);
      });

    const interval = setInterval(() => {
      getStats()
        .then((data) => {
          if (alive) setStats(data);
        })
        .catch(() => {});
    }, 30000);

    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, [refreshKey]);

  if (error || !stats) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="inline-flex items-center gap-2 text-xs text-text-tertiary"
    >
      <Sparkles className="w-3.5 h-3.5 text-solana-green" />
      <span>
        <span className="text-solana-green font-semibold">{stats.logos_found}</span> projects
        found
      </span>
      <span className="opacity-40">·</span>
      <span>
        <span className="text-text-secondary font-semibold">{stats.searches_total}</span> total
        searches
      </span>
    </motion.div>
  );
}

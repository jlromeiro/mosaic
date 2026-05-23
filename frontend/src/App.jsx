import { useState } from "react";
import { motion } from "framer-motion";

import Header from "./components/Header";
import Hero from "./components/Hero";
import UploadPanel from "./components/UploadPanel";
import MosaicViewer from "./components/MosaicViewer";
import ZoomCard from "./components/ZoomCard";
import Footer from "./components/Footer";
import SolanaFloatingElements from "./components/SolanaFloatingElements";
import { findLogo } from "./lib/api";

export default function App() {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);

  const handleSubmit = async (file) => {
    setLoading(true);
    setError(null);
    setMatch(null);
    try {
      const result = await findLogo(file);
      setMatch(result);
      setStatsRefreshKey((k) => k + 1);
      if (!result.found) {
        setError(
          result.message ||
            "We couldn't find a reliable match. Try uploading a clearer crop of your logo."
        );
      }
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMatch(null);
    setError(null);
  };

  return (
    <div className="min-h-screen relative bg-bg-primary text-text-primary">
      <SolanaFloatingElements />
      <Header />
      <Hero statsRefreshKey={statsRefreshKey} />

      <main className="relative z-10 px-6 md:px-12 pb-12">
        <div className="max-w-container mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <MosaicViewer match={match} />
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <UploadPanel
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
              onReset={handleReset}
            />
            {match && match.found && <ZoomCard match={match} onReset={handleReset} />}
          </motion.aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

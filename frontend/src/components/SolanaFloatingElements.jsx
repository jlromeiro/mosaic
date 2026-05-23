import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { loadSlim } from "@tsparticles/slim";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import SolanaLogo from "./SolanaLogo";

export default function SolanaFloatingElements() {
  const [particlesReady, setParticlesReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setParticlesReady(true));
  }, []);

  const particlesOptions = {
    fpsLimit: 60,
    fullScreen: { enable: false },
    background: { color: { value: "transparent" } },
    particles: {
      color: { value: ["#9945FF", "#14F195", "#00D4FF", "#FFFFFF"] },
      links: { enable: false },
      move: {
        enable: true,
        speed: 0.3,
        direction: "none",
        random: true,
        outModes: { default: "out" },
      },
      number: { value: 40, density: { enable: true, area: 1000 } },
      opacity: { value: { min: 0.1, max: 0.5 } },
      shape: { type: "circle" },
      size: { value: { min: 0.5, max: 1.8 } },
    },
    detectRetina: true,
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particlesReady && (
        <Particles
          id="solana-particles"
          options={particlesOptions}
          className="absolute inset-0"
        />
      )}

      <motion.div
        className="absolute top-[8%] right-[6%] opacity-40"
        animate={{ y: [0, -16, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <SolanaLogo size={18} />
      </motion.div>

      <motion.div
        className="absolute top-[28%] left-[4%] w-[280px] h-[280px] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(153,69,255,0.4) 0%, rgba(153,69,255,0) 70%)",
          filter: "blur(40px)",
        }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-[12%] right-[8%] w-[320px] h-[320px] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(20,241,149,0.35) 0%, rgba(20,241,149,0) 70%)",
          filter: "blur(50px)",
        }}
        animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
}

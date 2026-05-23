import { ExternalLink } from "lucide-react";
import SolanaLogo from "./SolanaLogo";

export default function Header() {
  return (
    <header className="relative z-20 px-6 md:px-12 pt-6 md:pt-8">
      <div className="max-w-container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <SolanaLogo size={14} />
          <span className="font-semibold tracking-tight text-text-primary">
            Mosaico Solana Hackathon
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://arena.colosseum.org/hackathon"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
              border border-border-emphasis hover:border-solana-cyan/60
              bg-bg-secondary/40 backdrop-blur-sm
              text-xs text-text-secondary hover:text-solana-cyan
              transition-colors"
          >
            <span>Colosseum Frontier</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <div className="hidden sm:flex items-center gap-2 text-xs text-text-tertiary">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-solana-green animate-pulse" />
            live
          </div>
        </div>
      </div>
    </header>
  );
}

import SolanaLogo from "./SolanaLogo";

export default function Header() {
  return (
    <header className="relative z-20 px-6 md:px-12 pt-6 md:pt-8">
      <div className="max-w-container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SolanaLogo size={14} />
          <span className="font-semibold tracking-tight text-text-primary">
            Mosaico Solana Hackathon
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-text-tertiary">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-solana-green animate-pulse" />
          live
        </div>
      </div>
    </header>
  );
}

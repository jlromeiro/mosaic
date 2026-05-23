import { ExternalLink } from "lucide-react";

// Coordenadas conhecidas da logo RPC no mosaico — descobertas pelo próprio
// matcher (confidence 0.90). Usadas pro easter egg de hover na assinatura.
export const RPC_PREVIEW_MATCH = {
  found: true,
  confidence: 0.9035,
  position: {
    x: 3429,
    y: 2166,
    width: 64,
    height: 63,
    centerX: 3461,
    centerY: 2197,
  },
  mosaic: { width: 4096, height: 3948 },
};

export default function Footer({ onPreviewEnter, onPreviewLeave }) {
  return (
    <footer className="relative z-20 px-6 md:px-12 py-10 mt-16">
      <div className="max-w-container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <a
          href="https://rpcpriority.com/"
          target="_blank"
          rel="noopener noreferrer"
          title="Learn more about our hackathon submission"
          className="group flex items-center gap-3 cursor-pointer
            transition-all duration-300 hover:scale-[1.02]
            focus:outline-none focus:ring-2 focus:ring-solana-green/40 rounded-lg
            -m-1 p-1"
          onMouseEnter={onPreviewEnter}
          onMouseLeave={onPreviewLeave}
          onFocus={onPreviewEnter}
          onBlur={onPreviewLeave}
          aria-label="Visit RPC Priority Protocol website — learn more about our hackathon submission (hover previews logo position in the mosaic)"
        >
          <img
            src="/logo-rpc.png"
            alt="RPC Priority Protocol"
            className="w-10 h-10 rounded-lg
              transition-shadow duration-300
              group-hover:shadow-[0_0_20px_rgba(20,241,149,0.6)]"
          />
          <div className="text-sm leading-tight">
            <div className="text-text-secondary group-hover:text-solana-green transition-colors">
              Powered by
            </div>
            <div className="font-semibold solana-gradient-text flex items-center gap-1.5">
              RPC Priority Protocol Project
              <ExternalLink
                className="w-3 h-3 text-text-tertiary group-hover:text-solana-green transition-colors"
                strokeWidth={2.5}
              />
            </div>
            <div className="text-[11px] text-text-tertiary group-hover:text-text-secondary transition-colors mt-0.5">
              Learn more about our hackathon submission
            </div>
          </div>
        </a>
        <div className="text-xs text-text-tertiary text-center sm:text-right">
          <div>Built for the Solana ecosystem</div>
          <div className="opacity-60 mt-1">No uploads stored. No login required.</div>
        </div>
      </div>
    </footer>
  );
}

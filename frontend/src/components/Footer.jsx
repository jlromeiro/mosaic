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
        <div
          className="group flex items-center gap-3 cursor-pointer
            transition-all duration-300 hover:scale-[1.02]"
          onMouseEnter={onPreviewEnter}
          onMouseLeave={onPreviewLeave}
          onFocus={onPreviewEnter}
          onBlur={onPreviewLeave}
          tabIndex={0}
          role="button"
          aria-label="Preview RPC Priority Protocol logo position in the mosaic"
        >
          <img
            src="/logo-rpc.png"
            alt="RPC Priority Protocol"
            className="w-10 h-10 rounded-lg
              transition-shadow duration-300
              group-hover:shadow-[0_0_20px_rgba(20,241,149,0.6)]"
          />
          <div className="text-sm">
            <div className="text-text-secondary group-hover:text-solana-green transition-colors">
              Powered by
            </div>
            <div className="font-semibold solana-gradient-text">
              RPC Priority Protocol Project
            </div>
          </div>
        </div>
        <div className="text-xs text-text-tertiary text-center sm:text-right">
          <div>Built for the Solana ecosystem</div>
          <div className="opacity-60 mt-1">No uploads stored. No login required.</div>
        </div>
      </div>
    </footer>
  );
}

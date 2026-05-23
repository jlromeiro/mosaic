export default function Footer() {
  return (
    <footer className="relative z-20 px-6 md:px-12 py-10 mt-16">
      <div className="max-w-container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/logo-rpc.png"
            alt="RPC Priority Protocol"
            className="w-10 h-10 rounded-lg"
          />
          <div className="text-sm">
            <div className="text-text-secondary">Powered by</div>
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

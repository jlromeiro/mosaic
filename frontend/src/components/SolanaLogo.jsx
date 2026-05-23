export default function SolanaLogo({ size = 32, className = "" }) {
  const w = size;
  const h = (size * 28) / 397;
  return (
    <svg
      viewBox="0 0 397 84"
      width={w * 3}
      height={h * 3}
      className={className}
      aria-label="Solana"
    >
      <defs>
        <linearGradient id="solGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9945FF" />
          <stop offset="100%" stopColor="#14F195" />
        </linearGradient>
        <linearGradient id="solGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9945FF" />
          <stop offset="100%" stopColor="#00D4FF" />
        </linearGradient>
        <linearGradient id="solGrad3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#14F195" />
        </linearGradient>
      </defs>
      <path
        d="M64.6,67.1 L11.6,67.1 C9.5,67.1 8.5,69.6 9.9,71.1 L20.1,82.4 C20.7,83.1 21.6,83.5 22.5,83.5 L78.4,83.5 C80.5,83.5 81.5,81 80.1,79.5 L69.9,68.2 C69.3,67.5 68.4,67.1 67.5,67.1 Z"
        fill="url(#solGrad1)"
      />
      <path
        d="M64.6,29.5 L11.6,29.5 C9.5,29.5 8.5,32 9.9,33.5 L20.1,44.8 C20.7,45.5 21.6,45.9 22.5,45.9 L78.4,45.9 C80.5,45.9 81.5,43.4 80.1,41.9 L69.9,30.6 C69.3,29.9 68.4,29.5 67.5,29.5 Z"
        fill="url(#solGrad2)"
      />
      <path
        d="M64.6,0 L11.6,0 C9.5,0 8.5,2.5 9.9,4 L20.1,15.3 C20.7,16 21.6,16.4 22.5,16.4 L78.4,16.4 C80.5,16.4 81.5,13.9 80.1,12.4 L69.9,1.1 C69.3,0.4 68.4,0 67.5,0 Z"
        fill="url(#solGrad3)"
      />
    </svg>
  );
}

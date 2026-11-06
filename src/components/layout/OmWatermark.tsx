export function OmWatermark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <text x="50" y="72" textAnchor="middle" fontSize="80" fill="currentColor" fontFamily="Noto Serif, serif">ॐ</text>
    </svg>
  );
}

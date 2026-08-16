/* "@airdev/next": "managed" */

'use client';

export default function CalculatorIllustration() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className="size-full">
      <rect
        x="18"
        y="10"
        width="72"
        height="96"
        rx="14"
        fill="var(--shell-illustration-surface)"
        fillOpacity="0.9"
      />
      <rect
        x="28"
        y="20"
        width="52"
        height="18"
        rx="6"
        fill="var(--shell-illustration-accent)"
      />
      <g fill="var(--shell-illustration-ink)">
        <rect x="28" y="48" width="12" height="12" rx="4" />
        <rect x="46" y="48" width="12" height="12" rx="4" />
        <rect x="64" y="48" width="12" height="12" rx="4" />
        <rect x="28" y="66" width="12" height="12" rx="4" />
        <rect x="46" y="66" width="12" height="12" rx="4" />
        <rect x="64" y="66" width="12" height="12" rx="4" />
        <rect x="28" y="84" width="12" height="12" rx="4" />
        <rect x="46" y="84" width="30" height="12" rx="4" />
      </g>
      <circle
        cx="96"
        cy="24"
        r="10"
        fill="var(--shell-illustration-highlight)"
        fillOpacity="0.9"
      />
      <path
        d="M96 18v12M90 24h12"
        stroke="var(--shell-illustration-ink)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

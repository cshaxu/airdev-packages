/* "@airdev/next": "managed" */

'use client';

export default function MathSymbolsIllustration() {
  return (
    <svg viewBox="0 0 220 220" aria-hidden="true" className="size-full">
      <circle
        cx="110"
        cy="110"
        r="88"
        fill="var(--shell-illustration-contrast-soft)"
        fillOpacity="0.14"
      />
      <circle
        cx="110"
        cy="110"
        r="64"
        fill="var(--shell-illustration-contrast-soft)"
        fillOpacity="0.18"
      />
      <g fill="var(--shell-illustration-contrast)">
        <path d="M58 92h28v6H58z" />
        <path d="M69 81h6v28h-6z" />
        <path d="M139 78h7v34h-7z" transform="rotate(45 142.5 95)" />
        <path d="M139 78h7v34h-7z" transform="rotate(-45 142.5 95)" />
        <path d="M64 138h26v6H64z" />
        <path d="M132 134h28v6h-28z" />
        <path d="M132 146h28v6h-28z" />
        <path d="M103 48h14v44h-14z" />
        <path d="M88 63h44v14H88z" />
      </g>
      <g
        fill="none"
        stroke="var(--shell-illustration-contrast)"
        strokeWidth="10"
        strokeLinecap="round"
      >
        <path d="M102 126c5-5 11-7 18-7 16 0 28 13 28 28s-12 28-28 28c-13 0-25-9-28-22" />
        <path d="M82 140l14 14-14 14" />
      </g>
    </svg>
  );
}

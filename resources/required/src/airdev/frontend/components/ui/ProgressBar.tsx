/* "@airdev/next": "managed" */

'use client';

type ProgressBarProps = { value: number; max?: number };

function clampProgress(value: number, max: number) {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) {
    return 0;
  }

  return Math.min(Math.max((value / max) * 100, 0), 100);
}

export default function ProgressBar({ value, max = 100 }: ProgressBarProps) {
  const progressPercent = clampProgress(value, max);

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.min(Math.max(value, 0), max)}
      className="bg-muted/70 dark:bg-muted/50 relative h-1 w-full overflow-hidden rounded-none"
    >
      <div
        className="h-full bg-[var(--button-default-bg)] transition-[width] duration-300 ease-out"
        style={{ width: `${progressPercent}%` }}
      />
    </div>
  );
}

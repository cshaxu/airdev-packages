/* "@airdev/next": "managed" */

'use client';

import { SHELL_PREVIEW_COLORS } from '@/airdev/common/theme';
import { airdevPublicConfig } from '@/airdev/config/public';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/airdev/frontend/components/ui/Dialog';
import {
  shellColorOptions,
  useShellColor,
} from '@/airdev/frontend/providers/ThemeProvider';
import { cn } from '@/airdev/frontend/utils/cn';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { ReactNode, useEffect, useState } from 'react';

type AppearanceDialogProps = {
  className?: string;
  labelClassName?: string;
  logoClassName?: string;
  showLabel?: boolean;
  logoSize?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  showTrigger?: boolean;
};

const modeOptions = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
] as const;

export default function AppearanceDialog({
  className,
  labelClassName,
  logoClassName,
  showLabel = true,
  logoSize = 40,
  open,
  onOpenChange,
  trigger,
  showTrigger = true,
}: AppearanceDialogProps) {
  const { shellColor, setShellColor } = useShellColor();
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activeThemeMode = isMounted ? (theme ?? 'light') : 'light';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {showTrigger ? (
        <DialogTrigger asChild>
          {trigger ?? (
            <button
              type="button"
              className={cn(
                'focus-visible:ring-ring inline-flex cursor-pointer items-center rounded-2xl text-left transition-colors focus-visible:ring-1 focus-visible:outline-none',
                className
              )}
              title="Open appearance settings"
              aria-label="Open appearance settings"
            >
              <Image
                src={airdevPublicConfig.shell.assets.logoSrc}
                alt={airdevPublicConfig.app.name}
                width={logoSize}
                height={logoSize}
                className={cn(
                  'aspect-square shrink-0 object-contain',
                  logoClassName
                )}
              />
              {showLabel ? (
                <span className={labelClassName}>
                  {airdevPublicConfig.app.name}
                </span>
              ) : (
                <span className="sr-only">{airdevPublicConfig.app.name}</span>
              )}
            </button>
          )}
        </DialogTrigger>
      ) : null}
      <DialogContent className="w-[calc(100vw-32px)] max-w-xl gap-0 rounded-[2rem] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Appearance</DialogTitle>
          <DialogDescription>
            Choose a mode and accent theme for this app.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="px-6 pb-6">
          <div className="grid grid-cols-3 gap-2">
            {modeOptions.map((option) => {
              const isActive = activeThemeMode === option.value;
              const Icon = option.Icon;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isActive}
                  className={cn(
                    'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-4 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-foreground border-[var(--shell-tint-600)] bg-[var(--shell-tint-100)]'
                      : 'border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                  )}
                  onClick={() => setTheme(option.value)}
                >
                  <Icon className="size-5" />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>

          <div className="px-[6px] py-4">
            <div className="h-px w-full bg-[var(--nav-separator)]" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {shellColorOptions.map((option) => {
              const isActive = shellColor === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isActive}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-colors',
                    isActive
                      ? 'text-foreground border-[var(--shell-tint-600)] bg-[var(--shell-tint-100)]'
                      : 'border-border text-foreground hover:bg-muted/60'
                  )}
                  onClick={() => setShellColor(option.value)}
                >
                  <span
                    className="size-3 shrink-0 rounded-full border border-black/10"
                    style={{
                      backgroundColor: SHELL_PREVIEW_COLORS[option.value],
                    }}
                  />
                  <span className="flex-1">{option.label}</span>
                  {isActive ? <Check className="size-4 shrink-0" /> : null}
                </button>
              );
            })}
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

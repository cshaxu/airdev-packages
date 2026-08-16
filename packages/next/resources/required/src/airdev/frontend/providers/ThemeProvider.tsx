/* "@airdev/next": "managed" */

'use client';

import type { ShellStyleColor } from '@/airdev/common/types/config';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';

const SHELL_COLOR_STORAGE_KEY = 'airdev-shell-color';

export const shellColorOptions = [
  { value: 'pink', label: 'Pink' },
  { value: 'red', label: 'Red' },
  { value: 'orange', label: 'Orange' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
  { value: 'purple', label: 'Purple' },
  { value: 'black', label: 'Black' },
] satisfies Array<{ value: ShellStyleColor; label: string }>;

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider> & {
  defaultShellColor: ShellStyleColor;
};

type ShellColorContextValue = {
  shellColor: ShellStyleColor;
  setShellColor: (color: ShellStyleColor) => void;
};

const ShellColorContext = React.createContext<ShellColorContextValue | null>(
  null
);

function isShellColor(value: string | null): value is ShellStyleColor {
  return shellColorOptions.some((option) => option.value === value);
}

export default function ThemeProvider({
  children,
  defaultShellColor,
  ...props
}: ThemeProviderProps) {
  const [shellColor, setShellColor] =
    React.useState<ShellStyleColor>(defaultShellColor);

  React.useEffect(() => {
    const storedColor = window.localStorage.getItem(SHELL_COLOR_STORAGE_KEY);
    if (isShellColor(storedColor)) {
      setShellColor(storedColor);
      return;
    }

    window.localStorage.setItem(SHELL_COLOR_STORAGE_KEY, defaultShellColor);
    setShellColor(defaultShellColor);
  }, [defaultShellColor]);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-shell-color', shellColor);
    window.localStorage.setItem(SHELL_COLOR_STORAGE_KEY, shellColor);
  }, [shellColor]);

  return (
    <ShellColorContext.Provider value={{ shellColor, setShellColor }}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </ShellColorContext.Provider>
  );
}

export function useShellColor() {
  const context = React.useContext(ShellColorContext);
  if (!context) {
    throw new Error('useShellColor must be used within ThemeProvider');
  }

  return context;
}

/* "@airdev/next": "managed" */

import type { ShellStyleColor } from './types/config';

export const GOOGLE_BRAND_COLORS = {
  yellow: '#fbbc05',
  red: '#ea4335',
  green: '#34a853',
  blue: '#4285f4',
} as const;

export const EMAIL_THEME = {
  background: '#ffffff',
  foreground: '#171717',
  muted: '#737373',
  border: '#e5e5e5',
  link: '#525252',
} as const;

export const SHELL_MANIFEST_COLORS: Record<
  ShellStyleColor,
  { theme: string; background: string }
> = {
  blue: { theme: '#0293ee', background: '#f9fbfe' },
  black: { theme: '#1f2023', background: '#f6f6f7' },
  green: { theme: '#1f9d55', background: '#f6fbf7' },
  yellow: { theme: '#d89b00', background: '#fffdf4' },
  red: { theme: '#e04848', background: '#fff8f8' },
  purple: { theme: '#8b5cf6', background: '#faf8ff' },
  pink: { theme: '#ec4899', background: '#fff8fc' },
  orange: { theme: '#f97316', background: '#fff9f5' },
} as const;

export const SHELL_PREVIEW_COLORS: Record<ShellStyleColor, string> = {
  blue: SHELL_MANIFEST_COLORS.blue.theme,
  black: SHELL_MANIFEST_COLORS.black.theme,
  green: SHELL_MANIFEST_COLORS.green.theme,
  yellow: SHELL_MANIFEST_COLORS.yellow.theme,
  red: SHELL_MANIFEST_COLORS.red.theme,
  purple: SHELL_MANIFEST_COLORS.purple.theme,
  pink: SHELL_MANIFEST_COLORS.pink.theme,
  orange: SHELL_MANIFEST_COLORS.orange.theme,
} as const;

/* "@airdev/next": "managed" */

import { airdevPublicConfig } from '@/airdev/config/public';
import ErrorBoundary from '@/airdev/frontend/components/ErrorBoundary';
import { Toaster } from '@/airdev/frontend/components/ui/Toaster';
import ReactQueryProvider from '@/airdev/frontend/providers/ReactQueryProvider';
import ThemeProvider from '@/airdev/frontend/providers/ThemeProvider';
import '@/airdev/frontend/styles/globals.css';
import { ReactNodeProps } from '@/airdev/frontend/types/props';
import { pageTitle } from '@/airdev/frontend/utils/page';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Suspense } from 'react';
import CookieBanner from './CookieBanner';
import PosthogInit from './PosthogInit';

function escapeCssString(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

const SHELL_FONT_FAMILY_NAME = '__airdev_shell_font__';
const SHELL_FONT_FALLBACK =
  '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif';

function getShellFontCss() {
  const { src, format } = airdevPublicConfig.shell.style.font;
  const escapedSrc = escapeCssString(src);

  return `
    @font-face {
      font-family: "${SHELL_FONT_FAMILY_NAME}";
      src: url("${escapedSrc}") format("${format}");
      font-display: swap;
    }

    :root {
      --shell-font-family: "${SHELL_FONT_FAMILY_NAME}", ${SHELL_FONT_FALLBACK};
    }
  `;
}

export function generateRootLayoutMetadata() {
  return {
    metadataBase: new URL(airdevPublicConfig.service.baseUrl),
    title: pageTitle(),
    description: airdevPublicConfig.app.description,
    applicationName: airdevPublicConfig.app.name,
    authors: [{ name: airdevPublicConfig.app.owner }],
    creator: airdevPublicConfig.app.owner,
    publisher: airdevPublicConfig.app.owner,
    keywords: airdevPublicConfig.app.keywords,
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      url: airdevPublicConfig.service.baseUrl,
      siteName: airdevPublicConfig.app.name,
      title: pageTitle(),
      description: airdevPublicConfig.app.description,
      images: [
        {
          url: airdevPublicConfig.shell.assets.logoSrc,
          alt: airdevPublicConfig.app.name,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: pageTitle(),
      description: airdevPublicConfig.app.description,
      images: [airdevPublicConfig.shell.assets.logoSrc],
    },
    icons: {
      icon: airdevPublicConfig.shell.assets.logoSrc,
      apple: airdevPublicConfig.shell.assets.logoSrc,
    },
  };
}

export default function RootLayout({ children }: ReactNodeProps) {
  return (
    <html
      lang="en"
      data-shell-color={airdevPublicConfig.shell.style.color}
      suppressHydrationWarning
    >
      <body>
        <style>{getShellFontCss()}</style>
        <ErrorBoundary>
          <ReactQueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              defaultShellColor={airdevPublicConfig.shell.style.color}
              enableSystem
              disableTransitionOnChange
            >
              <NuqsAdapter>
                {children}
                <CookieBanner />
                <Toaster />
                <Suspense>
                  <PosthogInit />
                </Suspense>
              </NuqsAdapter>
            </ThemeProvider>
          </ReactQueryProvider>
        </ErrorBoundary>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

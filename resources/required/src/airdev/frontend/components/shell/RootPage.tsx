/* "@airdev/next": "managed" */

import { airdevPublicConfig } from '@/airdev/config/public';
import { currentUserServerQueryOptions } from '@/airdev/frontend/hooks/data/user-server';
import { pageTitle, withError } from '@/airdev/frontend/utils/page';
import { clientComponentConfig } from '@/config/component';
import { QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export async function generateRootPageMetadata(): Promise<Metadata> {
  return {
    title: pageTitle(airdevPublicConfig.app.name),
    description: airdevPublicConfig.app.description,
    alternates: { canonical: '/' },
  };
}

async function RootPage() {
  const queryClient = new QueryClient();
  const currentUser = await queryClient.fetchQuery(
    currentUserServerQueryOptions
  );
  if (currentUser !== null) {
    redirect(airdevPublicConfig.shell.routes.homeHref);
  }

  const { LandingPage } = clientComponentConfig;
  if (LandingPage === undefined) {
    return <p>LandingPage component is missing.</p>;
  }
  return <LandingPage />;
}

export default withError(RootPage);

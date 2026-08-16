/* "@airdev/next": "managed" */

import ProtectedLayout from '@/airdev/frontend/components/shell/ProtectedLayout';
import { initializePermission } from '@/airdev/frontend/initializePermission';
import { ReactNodeProps } from '@/airdev/frontend/types/props';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default async function Layout({ children }: ReactNodeProps) {
  const queryClient = new QueryClient();
  await initializePermission(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProtectedLayout>{children}</ProtectedLayout>
    </HydrationBoundary>
  );
}

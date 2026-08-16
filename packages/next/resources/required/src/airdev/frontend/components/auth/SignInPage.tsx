/* "@airdev/next": "managed" */

import { currentUserServerQueryOptions } from '@/airdev/frontend/hooks/data/user-server';
import { pageTitle, withError } from '@/airdev/frontend/utils/page';
import { NextPageProps } from '@airent/api-next';
import { QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import SignInSteps from './SignInSteps';

export async function generateSignInMetadata(): Promise<Metadata> {
  return {
    title: pageTitle('Sign In'),
    description: 'Sign in to continue practicing with hanzi.study.',
    robots: { index: false, follow: false },
  };
}

async function SignInPage({
  searchParams,
}: NextPageProps<{}, { next: string }>) {
  const queryClient = new QueryClient();
  const { next } = await searchParams;
  const currentUser = await queryClient.fetchQuery(
    currentUserServerQueryOptions
  );

  if (currentUser) {
    redirect(next || '/');
  }

  return <SignInSteps />;
}

export default withError(SignInPage);

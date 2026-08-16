/* "@airdev/next": "managed" */

'use client';

import { AUTH_SIGNIN_HREF } from '@/airdev/common/constant';
import { Button } from '@/airdev/frontend/components/ui/Button';
import Link from 'next/link';
import { parseAsString, useQueryState } from 'nuqs';

function ErrorPage() {
  const [error] = useQueryState('error', parseAsString);
  const isVerificationError = error === 'Verification';

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">401</h1>
        <h2 className="mt-4 text-2xl font-semibold">Unable to sign in</h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          {isVerificationError
            ? 'The verification code is no longer valid. It may have already been used or expired. Please request a new code.'
            : 'Something went wrong while signing you in. Please try again later.'}
        </p>
        <Button asChild className="mt-6">
          <Link href={AUTH_SIGNIN_HREF}>Try Again</Link>
        </Button>
      </div>
    </main>
  );
}

export default ErrorPage;

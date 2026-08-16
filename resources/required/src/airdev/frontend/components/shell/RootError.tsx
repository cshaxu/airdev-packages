/* "@airdev/next": "managed" */

'use client';

import { logInfo } from '@airent/api';
import { NextErrorProps } from '@airent/api-next';
import { useEffect } from 'react';

export default function RootError({ error }: NextErrorProps) {
  useEffect(() => logInfo(error), [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h2 className="py-4">An error has occurred!</h2>
    </div>
  );
}

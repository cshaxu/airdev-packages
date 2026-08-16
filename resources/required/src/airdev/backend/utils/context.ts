/* "@airdev/next": "managed" */

import { Context } from '@/airdev/framework/context';
import { headers as getHeaders } from 'next/headers';

export async function mockContext(
  context?: Partial<Context>
): Promise<Context> {
  const headers = context?.headers ?? (await getHeaders());
  return {
    time: context?.time ?? new Date(),
    method: context?.method ?? '',
    url: context?.url ?? '',
    headers,
    currentUser: context?.currentUser ?? null,
  };
}

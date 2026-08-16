/* "@airdev/next": "managed" */

import { CurrentUser } from '@/airdev/common/types/context';
import { queryOptions } from '@tanstack/react-query';

export type NullableCurrentUser = CurrentUser | null;

export const currentUserQueryKey = ['currentUser'] as const;

export function createCurrentUserQueryOptions(
  queryFn: () => Promise<NullableCurrentUser>
) {
  return queryOptions({
    queryKey: currentUserQueryKey,
    retry: false,
    staleTime: 60 * 1000 * 5,
    queryFn,
  });
}

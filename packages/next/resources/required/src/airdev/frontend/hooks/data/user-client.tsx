/* "@airdev/next": "managed" */

'use client';

import {
  CurrentUser,
  CurrentUserFieldRequest,
} from '@/airdev/common/types/context';
import UserApiClient from '@/generated/clients/user';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import {
  createCurrentUserQueryOptions,
  NullableCurrentUser,
} from './user-base';

const getNullableCurrentUser = () =>
  UserApiClient.getOneSafe({ id: 'me' }, CurrentUserFieldRequest).then(
    (page) => page.user
  );

const nullableCurrentUserQueryOptions = createCurrentUserQueryOptions(
  getNullableCurrentUser
);

export const useNullableCurrentUser = () =>
  useQuery(nullableCurrentUserQueryOptions);

export const useRequiredCurrentUser = () => {
  const query = useSuspenseQuery(nullableCurrentUserQueryOptions);

  if (query.data === null) {
    throw new Error('A visitor should not access this page');
  }

  return query as typeof query & { data: CurrentUser };
};

export type { NullableCurrentUser };

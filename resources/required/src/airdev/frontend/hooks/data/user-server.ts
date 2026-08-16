/* "@airdev/next": "managed" */

import { CurrentUserFieldRequest } from '@/airdev/common/types/context';
import UserServerApiClient from '@/generated/server-clients/user';
import { createCurrentUserQueryOptions } from './user-base';

const getNullableCurrentUser = () =>
  UserServerApiClient.getOneSafe({ id: 'me' }, CurrentUserFieldRequest).then(
    (page) => page.user
  );

export const currentUserServerQueryOptions = createCurrentUserQueryOptions(
  getNullableCurrentUser
);

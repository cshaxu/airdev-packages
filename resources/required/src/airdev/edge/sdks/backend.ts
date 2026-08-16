/* "@airdev/next": "managed" */

import { HEADER_CURRENT_USER_ID_KEY } from '@/airdev/common/constant';
import {
  ContextUser,
  ContextUserFieldRequest,
} from '@/airdev/framework/context';
import UserEdgeApiClient from '@/generated/edge-clients/user';

export const getCurrentUser = async (
  headers: Headers,
  isReal: boolean = false
) =>
  UserEdgeApiClient.getOneSafe(
    { id: 'me' },
    ContextUserFieldRequest,
    isReal
      ? buildHeaders(headers, {
          excludedCookieKeys: [HEADER_CURRENT_USER_ID_KEY],
          excludedHeaderKeys: [HEADER_CURRENT_USER_ID_KEY],
        })
      : headers
  ).then((data: { user: ContextUser | null }) => data.user);

export function buildHeaders(
  headers: Headers,
  options: {
    additionalEntries?: Record<string, string | null>;
    excludedCookieKeys?: string[];
    excludedHeaderKeys?: string[];
  } = {}
): Headers {
  const cookie = headers.get('cookie');
  const newCookie =
    cookie === null
      ? null
      : cookie
          .split(';')
          .map((e) => e.trim().split('='))
          .filter(([k, _v]) => !(options.excludedCookieKeys ?? []).includes(k))
          .map((e) => e.join('='))
          .join('; ');
  const newHeaderEntries = Array.from(headers.entries())
    .filter(([k, _v]) => !(options.excludedHeaderKeys ?? []).includes(k))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
  return new Headers({
    ...newHeaderEntries,
    ...options.additionalEntries,
    ...(newCookie?.length && { cookie: newCookie }),
  });
}

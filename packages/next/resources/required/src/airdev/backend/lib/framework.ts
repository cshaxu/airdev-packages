/* "@airdev/next": "managed" */

import SystemRequestCacheService from '@/airdev/backend/services/data/system-request-cache';
import AirdevUserService from '@/airdev/backend/services/data/user-base';
import { mockContext } from '@/airdev/backend/utils/context';
import {
  HEADER_COOKIE_KEY,
  HEADER_CURRENT_USER_ID_KEY,
} from '@/airdev/common/constant';
import { logError } from '@/airdev/common/utils/logging';
import { airdevPrivateConfig } from '@/airdev/config/private';
import { airdevPublicConfig } from '@/airdev/config/public';
import {
  DispatcherOptions,
  commonDispatcherConfig,
  commonHandlerConfig,
} from '@/airdev/framework/callbacks';
import { Context, ContextUser } from '@/airdev/framework/context';
import { DispatcherConfig, Executor, wait } from '@airent/api';
import { HandlerConfig } from '@airent/api-next';
import createHttpError from 'http-errors';
import { pick } from 'lodash-es';
import { getServerSession } from 'next-auth';
import { authOptions } from './nextauth';

export const dispatcherConfig: Pick<
  DispatcherConfig<DispatcherOptions, Context, any, any, any, any>,
  'authorizer' | 'parserWrapper' | 'executorWrapper' | 'errorHandler'
> = { ...commonDispatcherConfig, executorWrapper };

export const handlerConfig: HandlerConfig<Context, any, any, any, any> = {
  ...commonHandlerConfig,
  authenticator,
};

async function authenticator(request: Request): Promise<Context> {
  const time = new Date();
  const { method, url, headers } = request;
  const currentUser = await getCurrentUser(headers);
  return { time, method, url, headers, currentUser };
}

async function getCurrentUser(headers: Headers): Promise<ContextUser | null> {
  // load actual current user
  const realCurrentUserPromise = getRealCurrentUser();
  // load became user
  const becameUserPromise = getBecameUser(headers);
  const [realCurrentUser, becameUser] = await Promise.all([
    realCurrentUserPromise,
    becameUserPromise,
  ]);
  if (
    airdevPublicConfig.service.serviceEnvironment === 'local' ||
    realCurrentUser?.isAdmin
  ) {
    return becameUser ?? realCurrentUser;
  }
  return realCurrentUser;
}

export async function getRealCurrentUser(): Promise<ContextUser | null> {
  const session = await getServerSession(authOptions);
  const { email } = session?.user ?? {};
  // load actual current user
  return email ? await getNullableUserSafe(email) : null;
}

async function getBecameUser(headers: Headers): Promise<ContextUser | null> {
  const userId = getCookieHeaderKey(headers, HEADER_CURRENT_USER_ID_KEY);
  return userId === null ? null : await getNullableUserSafe(userId);
}

async function getNullableUserSafe(id: string): Promise<ContextUser | null> {
  try {
    const context = await mockContext();
    const user = await AirdevUserService.getOneSafe({ id }, context);
    if (user === null) {
      return null;
    }
    const isAdmin = user.getIsAdmin();
    return { ...pick(user, ['id', 'name', 'email', 'createdAt']), isAdmin };
  } catch (error) {
    logError(error, { id });
    return null;
  }
}

function getCookieHeaderKey(headers: Headers, key: string): string | null {
  const cookierUserId =
    (headers.get(HEADER_COOKIE_KEY) ?? '')
      .split(';')
      .map((s) => s.trim().split('='))
      .filter(([k, _v]) => k === key)
      .map(([_k, v]) => v)
      .at(0) ?? null;
  const headerUserId = headers.get(key);
  return cookierUserId ?? headerUserId;
}

const CACHED_REQUEST_PATHS = [
  '/data/create-one-',
  '/data/update-one-',
  '/data/delete-one-',
];

function executorWrapper<PARSED, RESULT>(
  executor: Executor<PARSED, Context, RESULT>,
  options?: DispatcherOptions
): Executor<PARSED, Context, RESULT> {
  return async (parsed: PARSED, context: Context) => {
    const { url } = context;
    const requireRequestCache =
      options?.cacheRequest !== undefined
        ? options.cacheRequest
        : CACHED_REQUEST_PATHS.some((path) => url.includes(path));
    if (requireRequestCache) {
      const requestCache = await SystemRequestCacheService.createOneSafe(
        parsed,
        context
      );
      if (requestCache === null) {
        // key conflict
        let delay = 1000;
        do {
          const { completedAt, response } =
            await SystemRequestCacheService.getOne(parsed, context);
          if (completedAt === null) {
            // exponential backoff
            await wait(delay);
            delay *= 2;
          } else {
            return response as RESULT;
          }
        } while (delay < airdevPrivateConfig.database.delaySeconds * 1000);
        throw createHttpError.RequestTimeout();
      } else {
        // key acquired
        const result = await executor(parsed, context);
        await SystemRequestCacheService.updateOneSafe(
          requestCache.id,
          result,
          context
        );
        return result;
      }
    } else {
      return await executor(parsed, context);
    }
  };
}

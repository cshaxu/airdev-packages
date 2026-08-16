/* "@airdev/next": "managed" */

import { SystemRequestCacheEntity } from '@/airdev/backend/entities/system-request-cache';
import { createHash } from '@/airdev/backend/utils/token';
import { logError } from '@/airdev/common/utils/logging';
import { airdevPrivateConfig } from '@/airdev/config/private';
import { Context } from '@/airdev/framework/context';
import { purify } from '@airent/api';
import { subSeconds } from 'date-fns';
import createHttpError from 'http-errors';
import { omit } from 'lodash-es';

async function getOne(
  body: any,
  context: Context
): Promise<SystemRequestCacheEntity> {
  const id = await buildId(body, context);
  const one = await SystemRequestCacheEntity.findUnique(
    { where: { id } },
    context
  );
  if (one === null) {
    throw createHttpError.InternalServerError();
  }
  return one;
}

async function createOneSafe(
  body: any,
  context: Context
): Promise<SystemRequestCacheEntity | null> {
  const id = await buildId(body, context);
  try {
    return await SystemRequestCacheEntity.create(
      { data: { id, createdAt: context.time, request: body } },
      context
    );
  } catch (_err) {
    return null;
  }
}

async function updateOneSafe(
  id: string,
  response: any,
  context: Context
): Promise<SystemRequestCacheEntity | null> {
  const one = await SystemRequestCacheEntity.findUnique(
    { where: { id } },
    context
  );
  if (one === null) {
    return null;
  }
  try {
    one.fromModel({ completedAt: new Date(), response });
    return await one.save();
  } catch (error) {
    logError(error, {
      id: one.id,
      body: one.request,
      context: omit(one.context, 'headers'),
      response,
    });
    return null;
  }
}

async function buildId(body: any, context: Context): Promise<string> {
  const { time, method, url } = context;
  const chunk = Math.round(
    time.getTime() / (airdevPrivateConfig.database.delaySeconds * 1000)
  );
  const object = purify({ chunk, method, url, body });
  return await createHash(JSON.stringify(object));
}

async function deleteManyByTime(time: Date): Promise<number> {
  const cutoff = subSeconds(
    time,
    airdevPrivateConfig.database.delaySeconds * 2
  );
  const where = { createdAt: { lte: cutoff } };
  const count = await SystemRequestCacheEntity.count({ where });
  if (count === 0) {
    return count;
  }
  return await SystemRequestCacheEntity.deleteMany({ where }).then(
    (data) => data.count
  );
}

const SystemRequestCacheService = {
  getOne,
  createOneSafe,
  updateOneSafe,
  deleteManyByTime,
};

export default SystemRequestCacheService;

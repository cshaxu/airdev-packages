/* "@airdev/next": "seeded" */

import userSearchService from '@/airdev/backend/services/data/user-search';
import { Context } from '@/airdev/framework/context';
import { UserEntity } from '@/backend/entities/user';
import { SearchDocumentType } from '@/common/types/search';
import {
  CommonResponse,
  SearchServiceBase,
  buildInvalidErrorMessage,
  parseBodyWith,
} from '@airent/api';
import { BaseEntity } from 'airent';
import createHttpError from 'http-errors';
import * as z from 'zod';

export const Params = z.object({
  type: z.nativeEnum(SearchDocumentType),
  indexAll: z.boolean().optional(),
  reset: z.boolean().optional(),
  batchSize: z.number().min(1).optional(),
  ids: z.string().array().min(1).optional(),
  brandIds: z.string().array().min(1).optional(),
});
export type Params = z.infer<typeof Params>;

export const parser = parseBodyWith(Params);

export async function executor(
  params: Params,
  context: Context
): Promise<CommonResponse> {
  const { type } = params;
  let result = {};
  switch (type) {
    case SearchDocumentType.USER:
      result = await processIndex(
        params,
        userSearchService,
        UserEntity.findMany.bind(UserEntity),
        context
      );
      break;
    default:
      throw createHttpError.BadRequest(
        buildInvalidErrorMessage('type', 'SearchDocumentType', type)
      );
  }
  return { code: 200, result };
}

async function processIndex<
  S extends SearchServiceBase<any, any, any, any, any, any>,
  E extends BaseEntity<any, any, any>,
>(
  body: Params,
  searchService: S,
  manyGetter: (
    _params: { where: { id: { in: string[] } } },
    _context: Context
  ) => Promise<E[]>,
  context: Context
): Promise<{ reset: boolean; indexAll: boolean; count: number }> {
  const { reset: shouldReset, indexAll: shouldIndexAll, ids } = body;

  let reset = false;
  if (shouldReset) {
    reset = await searchService.resetIndex(context);
  }

  let indexAll = false;
  if (shouldIndexAll) {
    indexAll = await searchService.indexAll(context);
  }

  let count = 0;
  if (ids?.length) {
    const where = { id: { in: ids } };
    const many = await manyGetter({ where }, context);
    count += await searchService
      .indexMany(many, context)
      .then((a) => a.filter(Boolean).length);
  }
  return { reset, indexAll, count };
}

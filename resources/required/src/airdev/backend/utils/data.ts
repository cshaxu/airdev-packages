/* "@airdev/next": "managed" */

import { airdevPrivateConfig } from '@/airdev/config/private';
import { airdevPublicConfig } from '@/airdev/config/public';
import { Context } from '@/airdev/framework/context';
import { CommonResponse, buildInvalidErrorMessage, logInfo } from '@airent/api';
import { Awaitable, sequential } from 'airent';
import createHttpError from 'http-errors';

export async function batchExecuteByPageParam<ENTITY, RESULT, PAGE_PARAM>(
  loader: (
    pageParam: PAGE_PARAM | undefined,
    batchSize: number
  ) => Promise<ENTITY[]>,
  executor: (array: ENTITY[], previousResults: RESULT[]) => Promise<RESULT[]>,
  pageParamMapper: (entity: ENTITY) => PAGE_PARAM,
  batchSize: number = airdevPrivateConfig.database.batchSize,
  initialPageParam: PAGE_PARAM | undefined = undefined
): Promise<RESULT[]> {
  let pageParam = initialPageParam;
  const result: RESULT[] = [];
  let batch: ENTITY[] = [];
  do {
    batch = await loader(pageParam, batchSize);
    const expected = batch.length;
    const executed = await executor(batch, result);
    const actual = executed.length;
    if (actual !== expected) {
      throw createHttpError.InternalServerError(
        buildInvalidErrorMessage('batch', expected, actual)
      );
    }
    const last = batch.at(-1);
    pageParam = last ? pageParamMapper(last) : pageParam;
    result.push(...executed);
  } while (batch.length === batchSize);
  return result;
}

type BatchLoader<ENTITY, PAGE_PARAM> = (
  pageParam: PAGE_PARAM | undefined,
  batchSize: number
) => Promise<ENTITY[]>;

export async function batchFindFilteredMany<ENTITY, PAGE_PARAM>(
  loader: BatchLoader<ENTITY, PAGE_PARAM>,
  pageParamMapper: (entity: ENTITY) => PAGE_PARAM,
  filter: (entity: ENTITY) => Promise<boolean>,
  initialPageParam: PAGE_PARAM | undefined,
  pageSize: number,
  batchSize: number = airdevPublicConfig.defaults.apiBatchSize
): Promise<ENTITY[]> {
  const result = [];
  let batch: ENTITY[] = [];
  let pageParam = initialPageParam;
  let remainingPageSize = pageSize;
  do {
    batch = await loader(pageParam, batchSize);
    const last = batch.at(-1);
    pageParam = last ? pageParamMapper(last) : undefined;
    const filtered = await filterAsync(batch, filter, batchSize);
    const selected = filtered.slice(0, remainingPageSize);
    result.push(...selected);
    remainingPageSize -= selected.length;
  } while (remainingPageSize > 0 && batch.length > 0);
  return result;
}

export async function filterAsync<T>(
  array: T[],
  filter: (object: T) => Promise<boolean>,
  batchSize: number = airdevPrivateConfig.database.batchSize
): Promise<T[]> {
  const result = [];
  for (let i = 0; i < array.length; i += batchSize) {
    const batch = array.slice(i, i + batchSize);
    const conditions = await Promise.all(batch.map(filter));
    const filtered = batch.filter((_, index) => conditions[index]);
    result.push(...filtered);
  }
  return result;
}

type BatchStream<ENTITY, PAGE_PARAM> = {
  loader: BatchLoader<ENTITY, PAGE_PARAM>;
  page: ENTITY[];
};

export async function batchFindMultipleMany<ENTITY, PAGE_PARAM>(
  loaders: BatchLoader<ENTITY, PAGE_PARAM>[],
  pageParamMapper: (entity: ENTITY) => PAGE_PARAM,
  pageParamComparator: (a: PAGE_PARAM, b: PAGE_PARAM) => number,
  initialPageParam: PAGE_PARAM | undefined,
  pageSize: number
): Promise<ENTITY[]> {
  const initialPages = await Promise.all(
    loaders.map((loader) => loader(initialPageParam, pageSize))
  );
  let streams: BatchStream<ENTITY, PAGE_PARAM>[] = loaders
    .map((loader, i) => ({ loader, page: initialPages[i] }))
    .filter((stream) => stream.page.length > 0);
  const result: ENTITY[] = [];
  while (streams.length > 0 && result.length < pageSize) {
    const maxStream = streams.reduce(
      (acc, stream) =>
        acc &&
        pageParamComparator(
          pageParamMapper(acc.page[0]),
          pageParamMapper(stream.page[0])
        ) < 0
          ? acc
          : stream,
      undefined as BatchStream<ENTITY, PAGE_PARAM> | undefined
    )!;
    const entity = maxStream.page.shift()!;
    result.push(entity);
    if (maxStream.page.length === 0) {
      maxStream.page = await maxStream.loader(
        pageParamMapper(entity),
        pageSize
      );
    }
    streams = streams.filter((stream) => stream.page.length > 0);
  }
  return result;
}

export type BatchExecuteOneOptions = {
  batchSize?: number;
  isSequential?: boolean;
  isVerbose?: boolean;
};

export async function batchExecuteOneByPageParam<ENTITY, RESULT, PAGE_PARAM>(
  loader: (
    pageParam: PAGE_PARAM | undefined,
    batchSize: number
  ) => Promise<ENTITY[]>,
  pageParamMapper: (entity: ENTITY) => PAGE_PARAM,
  oneExecutor: (one: ENTITY) => Promise<RESULT>,
  reducer: (results: RESULT[]) => Awaitable<CommonResponse>,
  options: BatchExecuteOneOptions = {}
): Promise<CommonResponse> {
  const batchSize = options.batchSize ?? airdevPrivateConfig.database.batchSize;
  const isSequential = options.isSequential ?? false;
  const isVerbose = options.isVerbose ?? true;
  const executor = async (array: ENTITY[], previous: RESULT[]) => {
    let current;
    if (isSequential) {
      const functions = array.map((one) => () => oneExecutor(one));
      current = await sequential(functions);
    } else {
      const promises = array.map((one) => oneExecutor(one));
      current = await Promise.all(promises);
    }

    if (isVerbose) {
      const logParams = {
        previousTotal: previous.length,
        currentTotal: current.length,
        currentSuccess: current.filter(Boolean).length,
      };
      logInfo(logParams);
    }

    return current;
  };
  const results = await batchExecuteByPageParam(
    loader,
    executor,
    pageParamMapper,
    batchSize
  );
  const result = await reducer(results);
  return { code: 200, result };
}

export const backfillByPageParamWith =
  <ENTITY, PARAMS, PAGE_PARAM>(
    batchLoader: (
      params: PARAMS,
      context: Context,
      pageParam: PAGE_PARAM | undefined,
      batchSize: number
    ) => Promise<ENTITY[]>,
    pageParamMapper: (entity: ENTITY) => PAGE_PARAM,
    oneExecutor: (
      one: ENTITY,
      params: PARAMS,
      context: Context
    ) => Promise<boolean>,
    options: BatchExecuteOneOptions = {}
  ) =>
  (params: PARAMS, context: Context) =>
    batchExecuteOneByPageParam(
      (pageParam, batchSize) =>
        batchLoader(params, context, pageParam, batchSize),
      pageParamMapper,
      (one) => oneExecutor(one, params, context),
      (results) => ({
        code: 200,
        result: {
          total: results.length,
          success: results.filter(Boolean).length,
        },
      }),
      options
    );

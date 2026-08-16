/* "@airdev/next": "managed" */

import { airdevPublicConfig } from '@/airdev/config/public';
import * as z from 'zod';

export const DEFAULT_TAKE = z
  .number()
  .int()
  .positive()
  .max(airdevPublicConfig.defaults.apiBatchSize)
  .optional();

export const getTake = (
  query: { take?: number },
  defaultPageSize: number = airdevPublicConfig.defaults.pageSize
) => query.take ?? defaultPageSize;

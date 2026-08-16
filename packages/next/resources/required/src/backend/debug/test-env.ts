/* "@airdev/next": "managed" */

import { publicAppConfig } from '@/config/public';
import { CommonResponse, parseBodyWith } from '@airent/api';
import { pick } from 'lodash-es';
import * as z from 'zod';

export const Params = z.object({});
export type Params = z.infer<typeof Params>;

export const parser = parseBodyWith(Params);

export const executor = (_params: Params) =>
  ({
    code: 200,
    result: pick(publicAppConfig.service, [
      'dataEnvironment',
      'serviceEnvironment',
    ]),
  }) as CommonResponse;

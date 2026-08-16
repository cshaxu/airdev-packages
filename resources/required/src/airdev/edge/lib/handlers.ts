/* "@airdev/next": "managed" */

import {
  DispatcherOptions,
  commonDispatcherConfig,
} from '@/airdev/framework/callbacks';
import { Context } from '@/airdev/framework/context';
import { DispatcherConfig, dispatchWith } from '@airent/api';
import { handleWith } from '@airent/api-next';
import { edgeHandlerConfig } from './framework';

export const handleEdgeWith = <PARSED, RESULT, ERROR>(
  config: Pick<
    DispatcherConfig<
      DispatcherOptions,
      Context,
      Request,
      PARSED,
      RESULT,
      ERROR
    >,
    'parser' | 'executor' | 'executorWrapper' | 'options'
  >
) =>
  handleWith(
    dispatchWith({ ...commonDispatcherConfig, ...config }),
    edgeHandlerConfig
  );

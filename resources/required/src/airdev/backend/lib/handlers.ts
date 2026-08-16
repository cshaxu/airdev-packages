/* "@airdev/next": "managed" */

import { DispatcherOptions } from '@/airdev/framework/callbacks';
import { Context } from '@/airdev/framework/context';
import { DispatcherConfig, dispatchWith, parseBodyWith } from '@airent/api';
import { handleWith } from '@airent/api-next';
import * as z from 'zod';
import { dispatcherConfig, handlerConfig } from './framework';

// any in, any out
export const handleBackendAnyAnyWith = <PARSED, RESULT, ERROR>(
  config: Pick<
    DispatcherConfig<
      DispatcherOptions,
      Context,
      Request,
      PARSED,
      RESULT,
      ERROR
    >,
    'parser' | 'executor' | 'options'
  >
) =>
  handleWith(dispatchWith({ ...dispatcherConfig, ...config }), {
    ...handlerConfig,
    isCustomResponse: true,
  });

// json in, any out
export const handleBackendJsonAnyWith = <
  BODY_ZOD extends z.ZodTypeAny,
  RESULT,
  ERROR,
>(
  config: Pick<
    DispatcherConfig<
      DispatcherOptions,
      Context,
      Request,
      z.infer<BODY_ZOD>,
      RESULT,
      ERROR
    >,
    'executor' | 'options'
  > & { bodyZod: BODY_ZOD }
) =>
  handleBackendAnyAnyWith({
    ...config,
    parser: parseBodyWith(config.bodyZod),
  });

// any in, json out
export const handleBackendAnyJsonWith = <PARSED, RESULT, ERROR>(
  config: Pick<
    DispatcherConfig<
      DispatcherOptions,
      Context,
      Request,
      PARSED,
      RESULT,
      ERROR
    >,
    'parser' | 'executor' | 'options'
  >
) =>
  handleWith(dispatchWith({ ...dispatcherConfig, ...config }), handlerConfig);

// json in, json out
export const handleBackendJsonJsonWith = <
  BODY_ZOD extends z.ZodTypeAny,
  RESULT,
  ERROR,
>(
  config: Pick<
    DispatcherConfig<
      DispatcherOptions,
      Context,
      Request,
      z.infer<BODY_ZOD>,
      RESULT,
      ERROR
    >,
    'executor' | 'options'
  > & { bodyZod: BODY_ZOD }
) =>
  handleBackendAnyJsonWith({
    ...config,
    parser: parseBodyWith(config.bodyZod),
  });

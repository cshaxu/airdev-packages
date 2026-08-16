/* "@airdev/next": "managed" */

import { Context } from '@/airdev/framework/context';
import { CommonResponse, logInfo } from '@airent/api';

export const event = 'test';

/**
 * The data structure that your background job will receive as input.
 */
export type Params = { myParamItem: string };

/**
 * The main function that will be executed when your background job is triggered.
 * It receives the `Params` as input and should return a `CommonResponse` object.
 */
export async function executor(
  params: Params,
  _context: Context
): Promise<CommonResponse> {
  logInfo(params);
  if (params.myParamItem === 'someValue') {
    return { code: 500, error: { myErrorMessage: 'invalid value' } };
  }
  // implement some logic here
  return { code: 200, result: { myResult: 'done' } };
}

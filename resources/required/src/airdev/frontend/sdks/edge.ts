/* "@airdev/next": "managed" */

import {
  RevalidateQuery,
  RevalidateResult,
} from '@/airdev/common/types/api/edge';
import { fetchJsonOrThrow, queryStringify } from '@airent/api';

const revalidate = (query: RevalidateQuery): Promise<RevalidateResult> =>
  fetchJsonOrThrow(
    `/api/edge/revalidate?${queryStringify({ tag: query.tag })}`,
    { credentials: 'include', method: 'POST' }
  ).then((r) => r as RevalidateResult);

const AirdevEdgeApiClient = { revalidate };

export default AirdevEdgeApiClient;

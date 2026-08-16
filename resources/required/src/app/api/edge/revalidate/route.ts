/* "@airdev/next": "managed" */

import {
  RevalidateQuery,
  RevalidateResult,
} from '@/airdev/common/types/api/edge';
import { handleEdgeWith } from '@/airdev/edge/lib/handlers';
import { parseQueryWith } from '@airent/api';
import { revalidateTag } from 'next/cache';

const parser = parseQueryWith(RevalidateQuery);

async function executor(query: RevalidateQuery): Promise<RevalidateResult> {
  revalidateTag(query.tag, 'max');
  return { revalidated: true, now: Date.now() };
}

export const POST = handleEdgeWith({ parser, executor });

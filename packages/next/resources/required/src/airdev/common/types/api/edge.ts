/* "@airdev/next": "managed" */

import * as z from 'zod';

export const RevalidateQuery = z.object({ tag: z.string() });
export type RevalidateQuery = z.infer<typeof RevalidateQuery>;
export type RevalidateResult = { revalidated: boolean; now: number };

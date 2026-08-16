/* "@airdev/next": "managed" */

// library imports
import * as z from 'zod';

// query

export const GetManyNextauthAccountsQuery = z.object({
  userId: z.string(),
  type: z.string().optional(),
  provider: z.string().optional(),
});
export type GetManyNextauthAccountsQuery = z.infer<
  typeof GetManyNextauthAccountsQuery
>;

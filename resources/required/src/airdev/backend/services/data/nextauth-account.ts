/* "@airdev/next": "managed" */

import { NextauthAccountEntity } from '@/airdev/backend/entities/nextauth-account';
import { GetManyNextauthAccountsQuery } from '@/airdev/common/types/data/nextauth-account';
import { adminOrThrow, Context } from '@/airdev/framework/context';
import { Account } from 'next-auth';

/** unused for now since we haven't build support for unlinking sso */
async function _beforeGetMany(
  query: GetManyNextauthAccountsQuery,
  context: Context
): Promise<void> {
  const { currentUser } = context;
  if (currentUser === null || query.userId !== currentUser.id) {
    adminOrThrow(context);
  }
}

/** unused for now since we haven't build support for unlinking sso */
async function _getMany(
  query: GetManyNextauthAccountsQuery,
  context: Context
): Promise<NextauthAccountEntity[]> {
  const { userId, type, provider } = query;
  return await NextauthAccountEntity.findMany(
    { where: { userId, type, provider } },
    context
  );
}

async function getOneSafe(
  key: { provider: string; providerAccountId: string },
  context: Context
): Promise<NextauthAccountEntity | null> {
  return await NextauthAccountEntity.findUnique(
    { where: { provider_providerAccountId: key } },
    context
  );
}

async function updateOneSafe(
  key: { provider: string; providerAccountId: string },
  data: Account,
  context: Context
): Promise<NextauthAccountEntity | null> {
  const account = await getOneSafe(key, context);
  if (account === null) {
    return null;
  }
  account.fromModel(data);
  await account.save();
  return account;
}

const deleteManyByUser = (userId: string, _context: Context) =>
  NextauthAccountEntity.deleteMany({ where: { userId } }).then((r) => r.count);

const NextauthAccountService = { getOneSafe, updateOneSafe, deleteManyByUser };

export default NextauthAccountService;

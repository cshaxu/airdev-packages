/* "@airdev/next": "managed" */

import { mockContext } from '@/airdev/backend/utils/context';
import { SearchUsersQuery } from '@/airdev/common/types/data/user';
import { Context } from '@/airdev/framework/context';
import { UserEntity } from '@/backend/entities/user';
import {
  DefaultSearchDocument,
  DefaultSearchEngine,
  DefaultSearchQuery,
  SearchServiceBase,
} from '@airent/api';
import { Prisma } from '@prisma/client';
import { Awaitable } from 'airent';

const retriever = async (query: DefaultSearchQuery) => {
  const q = query.q?.trim();
  const context = await mockContext();
  const where = q
    ? { OR: [{ name: { contains: q } }, { email: { contains: q } }] }
    : {};
  const many = await UserEntity.findMany(
    { where, orderBy: { createdAt: Prisma.SortOrder.desc } },
    context
  );
  return many.map((one) => ({ id: one.id }));
};

export class UserSearchService extends SearchServiceBase<
  UserEntity,
  SearchUsersQuery,
  Context,
  DefaultSearchDocument,
  DefaultSearchQuery,
  object
> {
  public constructor() {
    super();
    this.engine = new DefaultSearchEngine({ User: retriever });
  }

  protected engine;

  protected indexName = 'User';

  protected indexSchema = {};

  protected entityKeyMapper(one: UserEntity): string {
    return one.id;
  }

  protected documentKeyMapper(one: DefaultSearchDocument): string {
    return one.id;
  }

  protected dehydrate(
    many: UserEntity[],
    _context: Context
  ): Awaitable<DefaultSearchDocument[]> {
    return many.map((one) => ({ id: one.id }));
  }

  protected async hydrate(
    documents: DefaultSearchDocument[],
    context: Context
  ): Promise<UserEntity[]> {
    const ids = documents.map((one) => one.id);
    if (ids.length === 0) {
      return [];
    }
    return await UserEntity.findMany({ where: { id: { in: ids } } }, context);
  }

  protected prepareQuery(
    query: SearchUsersQuery,
    _context: Context
  ): Awaitable<DefaultSearchQuery> {
    return query;
  }

  public indexAll(_context: Context): Awaitable<boolean> {
    return true;
  }
}

const userSearchService = new UserSearchService();

export default userSearchService;

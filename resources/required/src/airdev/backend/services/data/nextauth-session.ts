/* "@airdev/next": "managed" */

import { NextauthSessionEntity } from '@/airdev/backend/entities/nextauth-session';
import { Context } from '@/airdev/framework/context';

const deleteManyByUser = (userId: string, _context: Context) =>
  NextauthSessionEntity.deleteMany({ where: { userId } }).then((r) => r.count);

const NextauthSessionService = { deleteManyByUser };

export default NextauthSessionService;

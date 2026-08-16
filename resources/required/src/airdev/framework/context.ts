/* "@airdev/next": "managed" */

import { CurrentUser } from '@/airdev/common/types/context';
import { buildInvalidErrorMessage } from '@airent/api';
import createHttpError from 'http-errors';

export const ContextUserFieldRequest = {
  id: true,
  email: true,
  name: true,
  isAdmin: true,
  createdAt: true,
};

export type ContextUser = Pick<
  CurrentUser,
  'id' | 'email' | 'name' | 'isAdmin' | 'createdAt'
>;

export type Context = {
  time: Date;
  method: string;
  url: string;
  headers: Headers;
  currentUser: ContextUser | null;
};

export function adminOrThrow(context: Context): void {
  if (!isAdmin(context)) {
    throw createHttpError.Forbidden(buildInvalidErrorMessage('access'));
  }
}

export function selfOrThrow(context: Context, userId: string): void {
  if (!isSelf(context, userId)) {
    adminOrThrow(context);
  }
}

export function isSelfOrAdmin(context: Context, userId: string): boolean {
  return isSelf(context, userId) || isAdmin(context);
}

export function isAdmin(context: Context): boolean {
  return !!context.currentUser?.isAdmin;
}

export function isSelf(context: Context, userId: string): boolean {
  return context.currentUser?.id === userId;
}

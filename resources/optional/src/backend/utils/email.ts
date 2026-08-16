/* "@airdev/next": "seeded" */

import { UserEntity } from '@/backend/entities/user';

export const buildEmailParticipant = (displayName: string, email: string) =>
  `${displayName} <${email}>`;

export const buildEmailSender = (displayName: string, sender: string) =>
  buildEmailParticipant(displayName, `${sender}@nanoindies.com`);

export const buildUserEmailParticipant = (user: UserEntity) =>
  buildEmailParticipant(user.name ?? user.email.split('@')[0], user.email);

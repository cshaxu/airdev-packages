/* "@airdev/next": "managed" */

export type BecomeBody = { userId: string | null };

export const CurrentUserFieldRequest = {
  id: true,
  email: true,
  name: true,
  imageUrl: true,
  isAdmin: true,
  createdAt: true,
};

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  createdAt: Date;
  imageUrl: string | null;
};

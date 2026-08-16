/* "@airdev/next": "managed" */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface BecameUser {
  id: string;
  name: string;
  imageUrl: string | null;
  isAdmin: boolean;
}

interface BecameUserState {
  user: BecameUser | null;
  setUser: (user: BecameUser | null) => void;
}

const useBecameUserStore = create<BecameUserState>()(
  persist((set) => ({ user: null, setUser: (user) => set({ user }) }), {
    name: 'became-user',
    storage: createJSONStorage(() => localStorage),
  })
);

export const useBecameUser = () => useBecameUserStore((state) => state.user);

export const useSetBecameUser = () =>
  useBecameUserStore((state) => state.setUser);

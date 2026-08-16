/* "@airdev/next": "managed" */

import { CurrentUser } from '@/airdev/common/types/context';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface CurrentUserState {
  user: CurrentUser | undefined;
  setUser: (user: CurrentUser | undefined) => void;
}

const useCurrentUserStore = create<CurrentUserState>()(
  persist((set) => ({ user: undefined, setUser: (user) => set({ user }) }), {
    name: 'current-user',
    storage: createJSONStorage(() => sessionStorage),
  })
);

export const useCurrentUser = () => useCurrentUserStore((state) => state.user);

export const useSetUser = () => useCurrentUserStore((state) => state.setUser);

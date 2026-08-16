/* "@airdev/next": "managed" */

'use client';

import { useNullableCurrentUser } from '@/airdev/frontend/hooks/data/user-client';
import {
  useBecameUser,
  useSetBecameUser,
} from '@/airdev/frontend/stores/becameUserStore';
import { useSetUser } from '@/airdev/frontend/stores/currentUserStore';
import { useEffect, useRef } from 'react';

export default function CurrentUserProvider() {
  const setUser = useSetUser();
  const becameUser = useBecameUser();
  const setBecameUser = useSetBecameUser();
  const { data: currentUser } = useNullableCurrentUser();
  const becameUserRef = useRef(becameUser);

  useEffect(() => {
    setUser(currentUser ?? undefined);
  }, [currentUser, setUser]);

  useEffect(() => {
    becameUserRef.current = becameUser;
  }, [becameUser]);

  useEffect(() => {
    const activeBecameUser = becameUserRef.current;
    if (currentUser === undefined || activeBecameUser === null) {
      return;
    }

    if (currentUser === null || currentUser.id !== activeBecameUser.id) {
      setBecameUser(null);
    }
  }, [currentUser, setBecameUser]);

  return null;
}

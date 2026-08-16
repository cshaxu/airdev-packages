/* "@airdev/next": "managed" */

'use client';

import { ROOT_HREF } from '@/airdev/common/constant';
import { useNullableCurrentUser } from '@/airdev/frontend/hooks/data/user-client';
import { useSetUser } from '@/airdev/frontend/stores/currentUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRouteRedirect() {
  const router = useRouter();
  const setUser = useSetUser();
  const { data: currentUser, isFetched, isFetching } = useNullableCurrentUser();

  useEffect(() => {
    if (!isFetched || isFetching || currentUser !== null) {
      return;
    }

    setUser(undefined);
    router.replace(ROOT_HREF);
  }, [currentUser, isFetched, isFetching, router, setUser]);

  return null;
}

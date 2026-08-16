/* "@airdev/next": "managed" */

import { getRealCurrentUser } from '@/airdev/backend/lib/framework';
import { ROOT_HREF } from '@/airdev/common/constant';
import { initializePermission } from '@/airdev/frontend/initializePermission';
import { ReactNodeProps } from '@/airdev/frontend/types/props';
import { QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import AdminNav from './AdminNav';

export default async function AdminLayout({ children }: ReactNodeProps) {
  const queryClient = new QueryClient();
  await initializePermission(queryClient);
  const realCurrentUser = await getRealCurrentUser();
  if (!realCurrentUser?.isAdmin) {
    return redirect(ROOT_HREF);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <AdminNav />
      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="size-full overflow-auto p-6">{children}</div>
      </div>
    </div>
  );
}

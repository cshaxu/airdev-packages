/* "@airdev/next": "managed" */

import HeaderBarWithHome from '@/airdev/frontend/components/shell/HeaderBarWithHome';
import { Skeleton } from '@/airdev/frontend/components/ui/Skeleton';

export default function SettingsLoading() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <HeaderBarWithHome isLoading />
      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="size-full overflow-y-auto p-6">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="space-y-4 rounded-2xl border p-5 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="size-16 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-3">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

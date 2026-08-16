/* "@airdev/next": "managed" */

import CurrentUserProvider from '@/airdev/frontend/providers/CurrentUserProvider';
import { ReactNodeProps } from '@/airdev/frontend/types/props';
import BottomNavBar from './navigation/BottomNavBar';
import SideNavBar from './navigation/SideNavBar';
import ProtectedRouteRedirect from './ProtectedRouteRedirect';

export function generateProtectedLayoutMetadata() {
  return { robots: { index: false, follow: false, nocache: true } };
}

export default function ProtectedLayout({ children }: ReactNodeProps) {
  return (
    <>
      <CurrentUserProvider />
      <ProtectedRouteRedirect />
      <div className="bg-background fixed inset-0 flex flex-col overflow-hidden">
        <main className="min-h-0 flex-1 overflow-hidden">
          <div className="flex h-full min-h-0">
            <div className="hidden md:block [@media(orientation:portrait)]:hidden">
              <SideNavBar />
            </div>
            <div className="protected-mobile-main min-h-0 min-w-0 flex-1 overflow-hidden pb-16 md:pb-0 [@media(orientation:portrait)]:pb-16">
              {children}
            </div>
          </div>
        </main>
        <BottomNavBar />
      </div>
    </>
  );
}

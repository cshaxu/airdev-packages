/* "@airdev/next": "managed" */

'use client';

import { airdevPublicConfig } from '@/airdev/config/public';
import AppearanceDialog from '@/airdev/frontend/components/shell/AppearanceDialog';
import { buttonVariants } from '@/airdev/frontend/components/ui/Button';
import { PixelResizablePanel } from '@/airdev/frontend/components/ui/PixelResizable';
import { cn } from '@/airdev/frontend/utils/cn';
import { clientComponentConfig } from '@/config/component';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import UserButton from './UserButton';

type NavItem = {
  to: string;
  label: string;
  renderIcon: (className: string) => React.ReactNode;
  isActive: (pathname: string) => boolean;
};

type SideNavLinkProps = {
  label: string;
  icon: React.ReactNode;
  to: string;
  isFull: boolean;
  isActive: boolean;
};

function matchesCollapsedRoute(pathname: string, route: string) {
  const normalizedPathname =
    pathname !== '/' ? pathname.replace(/\/+$/, '') : pathname;

  if (route.endsWith('/')) {
    return normalizedPathname.startsWith(route.slice(0, -1) + '/');
  }

  return (
    normalizedPathname === route || normalizedPathname.startsWith(`${route}/`)
  );
}

function SideNavLink({ label, icon, to, isFull, isActive }: SideNavLinkProps) {
  return (
    <Link
      href={to}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        isFull ? 'rounded-xl' : 'rounded-full',
        'p-2',
        'nav-text',
        'hover:bg-[var(--nav-hover)]',
        isActive && 'nav-active',
        isFull ? 'w-full justify-start' : 'size-9 justify-center self-center'
      )}
      title={isFull ? undefined : label}
    >
      {icon}
      {isFull && <span className="ml-2">{label}</span>}
    </Link>
  );
}

export default function SideNavBar() {
  const pathname = usePathname();
  const lastPathRef = useRef(pathname);
  const defaultSideNavCollapsedRoutes =
    airdevPublicConfig.shell.routes.defaultSideNavCollapsedRoutes;

  const { navItems } = clientComponentConfig.NavContent() as {
    navItems: NavItem[];
  };

  const shouldCollapse = defaultSideNavCollapsedRoutes.some((route) =>
    matchesCollapsedRoute(pathname, route)
  );
  const [isCollapsed, setIsCollapsed] = useState(shouldCollapse);

  useEffect(() => {
    const wasCollapsePage = defaultSideNavCollapsedRoutes.some((route) =>
      matchesCollapsedRoute(lastPathRef.current, route)
    );
    const isCollapsePage = defaultSideNavCollapsedRoutes.some((route) =>
      matchesCollapsedRoute(pathname, route)
    );

    if (wasCollapsePage !== isCollapsePage) {
      setIsCollapsed(isCollapsePage);
    }

    lastPathRef.current = pathname;
  }, [defaultSideNavCollapsedRoutes, pathname]);

  return (
    <PixelResizablePanel
      collapsedSize={56}
      minSize={200}
      maxSize={480}
      defaultSize={240}
      isCollapsed={isCollapsed}
      onCollapseChange={setIsCollapsed}
    >
      <div className="nav-bg flex h-full min-h-0 flex-col gap-4 overflow-hidden px-2 py-4">
        <div
          className={cn(
            'flex flex-shrink-0 items-center',
            !isCollapsed ? 'gap-2' : 'justify-center'
          )}
        >
          <AppearanceDialog
            className={cn(
              'nav-icon hover:bg-[var(--nav-hover)]',
              !isCollapsed
                ? 'w-full gap-2 px-1 py-1'
                : 'size-9 justify-center self-center rounded-2xl p-0.5'
            )}
            labelClassName="nav-icon text-xl font-bold"
            logoClassName={isCollapsed ? 'size-8' : 'size-10'}
            showLabel={!isCollapsed}
            logoSize={isCollapsed ? 32 : 40}
          />
        </div>

        <div className="nav-separator mx-4 h-px flex-shrink-0" />

        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
          {navItems.map((item: NavItem) => (
            <SideNavLink
              key={item.to}
              label={item.label}
              to={item.to}
              icon={item.renderIcon('nav-icon size-4')}
              isFull={!isCollapsed}
              isActive={item.isActive(pathname)}
            />
          ))}
        </nav>

        <div className="flex-shrink-0 pt-2">
          <UserButton mode="sidebar" isFull={!isCollapsed} />
        </div>
      </div>
    </PixelResizablePanel>
  );
}

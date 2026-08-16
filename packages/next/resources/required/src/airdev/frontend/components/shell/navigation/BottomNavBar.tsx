/* "@airdev/next": "managed" */

'use client';

import { useRequiredCurrentUser } from '@/airdev/frontend/hooks/data/user-client';
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

export default function BottomNavBar() {
  const pathname = usePathname();
  const { navItems } = clientComponentConfig.NavContent() as {
    navItems: NavItem[];
  };

  useRequiredCurrentUser();
  const navItemsRef = useRef<HTMLDivElement>(null);
  const [showLabels, setShowLabels] = useState(true);

  useEffect(() => {
    const element = navItemsRef.current;
    if (!element) {
      return;
    }

    const updateLabelVisibility = () => {
      const minTabWidthForLabel = 74;
      const tabCount = navItems.length + 1; // +1 for account tab
      const shouldShow = element.clientWidth >= tabCount * minTabWidthForLabel;
      setShowLabels(shouldShow);
    };

    updateLabelVisibility();
    const observer = new ResizeObserver(updateLabelVisibility);
    observer.observe(element);
    return () => observer.disconnect();
  }, [navItems.length]);

  return (
    <nav
      className={cn(
        'mobile-bottom-nav bg-background/95 border-border fixed right-0 bottom-0 left-0 z-40 border-t backdrop-blur',
        'md:hidden [@media(orientation:portrait)]:block'
      )}
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0px)' }}
    >
      <div
        ref={navItemsRef}
        className="mx-auto flex h-16 max-w-xl items-center px-2"
      >
        {navItems.map((item: NavItem) => {
          const active = item.isActive(pathname);
          return (
            <Link
              key={item.to}
              href={item.to}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 rounded-lg py-1 text-[11px] transition-colors',
                active ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {item.renderIcon('size-5')}
              {showLabels && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          );
        })}
        <UserButton mode="bottom-nav" showLabel={showLabels} />
      </div>
    </nav>
  );
}

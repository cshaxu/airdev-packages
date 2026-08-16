/* "@airdev/next": "managed" */

'use client';

import { ADMIN_API_HREF, ADMIN_USERS_HREF } from '@/airdev/common/constant';
import { airdevPublicConfig } from '@/airdev/config/public';
import HeaderBarWithHome from '@/airdev/frontend/components/shell/HeaderBarWithHome';
import type { BreadcrumbItem } from '@/airdev/frontend/components/ui/ResponsiveBreadcrumb';
import { cn } from '@/airdev/frontend/utils/cn';
import { usePathname } from 'next/navigation';

type AdminTab = { href: string; label: string };

export default function AdminNav() {
  const pathname = usePathname();
  const adminTabs: AdminTab[] = [
    { label: 'API', href: ADMIN_API_HREF },
    { label: 'Users', href: ADMIN_USERS_HREF },
    ...airdevPublicConfig.shell.adminTabs,
  ];

  const tabs: BreadcrumbItem[] = adminTabs.map((tab) => ({
    href: tab.href,
    label: (
      <span
        className={cn(
          pathname === tab.href || pathname.startsWith(tab.href + '/')
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground'
        )}
      >
        {tab.label}
      </span>
    ),
  }));

  return <HeaderBarWithHome items={[{ label: 'Admin' }]} tabs={tabs} />;
}

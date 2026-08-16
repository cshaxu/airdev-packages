/* "@airdev/next": "managed" */

'use client';

import { airdevPublicConfig } from '@/airdev/config/public';
import HeaderBar from '@/airdev/frontend/components/ui/HeaderBar';
import { type BreadcrumbItem } from '@/airdev/frontend/components/ui/ResponsiveBreadcrumb';
import { Home } from 'lucide-react';
import * as React from 'react';
import { createElement } from 'react';

type Props = React.PropsWithChildren<{
  items?: BreadcrumbItem[];
  tabs?: BreadcrumbItem[];
  isLoading?: boolean;
}>;

export default function HeaderBarWithHome({ items, ...rest }: Props) {
  const fullItems = [
    {
      label: createElement(Home, { className: 'size-4' }),
      href: airdevPublicConfig.shell.routes.homeHref,
    },
    ...(items ?? []),
  ];

  return <HeaderBar {...rest} items={fullItems} />;
}

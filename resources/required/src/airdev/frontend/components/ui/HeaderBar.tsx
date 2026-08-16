/* "@airdev/next": "managed" */

'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu';
import {
  type BreadcrumbItem,
  ResponsiveBreadcrumb,
} from './ResponsiveBreadcrumb';
import TranslateButton from './TranslateButton';

const MIN_BREADCRUMB_WIDTH = 30;
const MIN_CENTER_GAP = 20;
const HEADER_SHELL_CLASS =
  'header-bg dark:bg-background/80 relative h-12 w-full items-center px-6 backdrop-blur-lg';
const HEADER_ACTIONS_CLASS =
  'flex flex-none items-center justify-end space-x-4 pl-4';
const MENU_ITEM_CONTENT_CLASS = 'flex w-full cursor-pointer items-center gap-2';
const TAB_CLASS = 'rounded-md px-3 py-1.5 text-sm font-medium';
const TAB_LINK_CLASS =
  'text-muted-foreground hover:bg-accent/50 hover:text-foreground rounded-md px-3 py-1.5 text-sm font-medium transition-colors';

type Props = React.PropsWithChildren<{
  items?: BreadcrumbItem[];
  tabs?: BreadcrumbItem[];
  isLoading?: boolean;
}>;

export default function HeaderBar({
  items,
  tabs,
  children,
  isLoading = false,
}: Props) {
  const headerRef = useRef<HTMLDivElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const centerMeasureRef = useRef<HTMLDivElement>(null);
  const [shouldShowCollapsedMenu, setShouldShowCollapsedMenu] = useState(false);
  const [breadcrumbMaxWidth, setBreadcrumbMaxWidth] = useState<number | null>(
    null
  );
  const hasTabs = (tabs?.length ?? 0) > 0;
  const hasCenteredChildren = !hasTabs && !!children;
  const shouldShowVisibleTabs = hasTabs && !shouldShowCollapsedMenu;

  useEffect(() => {
    if (!hasTabs) {
      setShouldShowCollapsedMenu(false);
      setBreadcrumbMaxWidth(null);
      return;
    }

    const header = headerRef.current;
    const container = contentContainerRef.current;
    const measure = centerMeasureRef.current;
    if (!header || !container || !measure) {
      return;
    }

    let frameId = 0;

    const updateLayoutState = () => {
      const headerRect = header.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const centerWidth = measure.getBoundingClientRect().width;
      const centerLeft = headerRect.left + (headerRect.width - centerWidth) / 2;
      const nextBreadcrumbMaxWidth = Math.max(
        Math.floor(centerLeft - containerRect.left - MIN_CENTER_GAP),
        0
      );
      const nextShouldCollapse =
        measure.scrollWidth > container.clientWidth ||
        nextBreadcrumbMaxWidth < MIN_BREADCRUMB_WIDTH;

      setBreadcrumbMaxWidth(nextBreadcrumbMaxWidth);
      setShouldShowCollapsedMenu(nextShouldCollapse);
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(updateLayoutState);
    };

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(header);
    observer.observe(container);
    observer.observe(measure);
    scheduleUpdate();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [hasTabs, items, tabs]);

  if (isLoading) {
    return (
      <div className="header-bg dark:bg-background/80 flex h-12 w-full items-center px-6 backdrop-blur-lg" />
    );
  }

  return (
    <div
      ref={headerRef}
      className={`${HEADER_SHELL_CLASS} ${
        hasCenteredChildren
          ? 'grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-x-5'
          : 'flex'
      }`}
    >
      <div
        ref={contentContainerRef}
        className={`relative flex min-w-0 items-center gap-4 ${
          hasCenteredChildren ? '' : 'flex-1'
        }`}
      >
        {hasTabs && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-0">
            <HeaderCenterMeasure
              ref={centerMeasureRef}
              items={items}
              tabs={tabs}
            />
          </div>
        )}

        {shouldShowCollapsedMenu ? (
          <HeaderCollapsedMenu items={items} tabs={tabs} />
        ) : (
          !!items?.length && (
            <div
              className="min-w-0 flex-1"
              style={
                hasTabs && breadcrumbMaxWidth !== null
                  ? { maxWidth: `${breadcrumbMaxWidth}px` }
                  : undefined
              }
            >
              <ResponsiveBreadcrumb items={items} />
            </div>
          )
        )}
      </div>

      {hasCenteredChildren ? (
        <div className="flex items-center justify-center">{children}</div>
      ) : null}

      {shouldShowVisibleTabs ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="pointer-events-auto flex gap-1">
            <HeaderTabItems tabs={tabs} />
          </div>
        </div>
      ) : null}

      {/* Right: Actions */}
      <div
        className={`${HEADER_ACTIONS_CLASS} ${hasCenteredChildren ? '' : 'ml-auto'}`}
      >
        <TranslateButton />
      </div>
    </div>
  );
}

function getHeaderItemKey(item: BreadcrumbItem, index: number) {
  return item.href ?? `header-item-${index}`;
}

function HeaderMenuEntry({
  item,
  fallbackLabel,
}: {
  item: BreadcrumbItem;
  fallbackLabel?: React.ReactNode;
}) {
  const content = <span>{item.label || fallbackLabel}</span>;

  return (
    <DropdownMenuItem asChild>
      {item.href ? (
        <Link href={item.href} className={MENU_ITEM_CONTENT_CLASS}>
          {content}
        </Link>
      ) : (
        <span className={MENU_ITEM_CONTENT_CLASS}>{content}</span>
      )}
    </DropdownMenuItem>
  );
}

function HeaderTabItems({ tabs }: { tabs?: BreadcrumbItem[] }) {
  return tabs?.map((item, index) =>
    item.href ? (
      <Link
        key={getHeaderItemKey(item, index)}
        href={item.href}
        className={TAB_LINK_CLASS}
      >
        {item.label}
      </Link>
    ) : (
      <span key={getHeaderItemKey(item, index)} className={TAB_CLASS}>
        {item.label}
      </span>
    )
  );
}

const HeaderCenterMeasure = React.forwardRef<
  HTMLDivElement,
  {
    items?: BreadcrumbItem[];
    tabs?: BreadcrumbItem[];
  }
>(function HeaderCenterMeasure({ items, tabs }, ref) {
  return (
    <div ref={ref} className="inline-flex items-center gap-4 whitespace-nowrap">
      {!!items?.length && (
        <div className="inline-flex items-center gap-2 text-sm font-medium whitespace-nowrap">
          {items.map((item, index) => (
            <div
              key={getHeaderItemKey(item, index)}
              className="inline-flex items-center gap-2"
            >
              {index > 0 ? (
                <span className="text-muted-foreground/50">/</span>
              ) : null}
              {item.label ? <span>{item.label}</span> : null}
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-1">
        <HeaderTabItems tabs={tabs} />
      </div>
    </div>
  );
});

function HeaderCollapsedMenu({
  items,
  tabs,
}: {
  items?: BreadcrumbItem[];
  tabs?: BreadcrumbItem[];
}) {
  const hasItems = (items?.length ?? 0) > 0;
  const hasTabs = (tabs?.length ?? 0) > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:text-foreground text-muted-foreground flex size-9 cursor-pointer items-center justify-center rounded-md transition-colors">
        <Menu className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {items?.map((item, index) => (
          <HeaderMenuEntry
            key={getHeaderItemKey(item, index)}
            item={item}
            fallbackLabel="Home"
          />
        ))}
        {hasItems && hasTabs ? <DropdownMenuSeparator /> : null}
        {tabs?.map((item, index) => (
          <HeaderMenuEntry key={getHeaderItemKey(item, index)} item={item} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

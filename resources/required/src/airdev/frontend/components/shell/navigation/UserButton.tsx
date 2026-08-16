/* "@airdev/next": "managed" */

'use client';

import { ADMIN_HREF, ROOT_HREF, SETTINGS_HREF } from '@/airdev/common/constant';
import AppearanceDialog from '@/airdev/frontend/components/shell/AppearanceDialog';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/airdev/frontend/components/ui/Avatar';
import {
  BottomPopupSheet,
  BottomPopupSheetContent,
  BottomPopupSheetDescription,
  BottomPopupSheetHeader,
  BottomPopupSheetTitle,
  BottomPopupSheetTrigger,
} from '@/airdev/frontend/components/ui/BottomPopupSheet';
import { Button } from '@/airdev/frontend/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/airdev/frontend/components/ui/DropdownMenu';
import { useRequiredCurrentUser } from '@/airdev/frontend/hooks/data/user-client';
import AirdevBackendApiClient from '@/airdev/frontend/sdks/backend';
import {
  useBecameUser,
  useSetBecameUser,
} from '@/airdev/frontend/stores/becameUserStore';
import { cn } from '@/airdev/frontend/utils/cn';
import {
  ChevronRightIcon,
  Cog6ToothIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import { ArrowLeft, LogOut, Palette, Wrench } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  ReactNode,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

type SidebarProps = { mode: 'sidebar'; isFull: boolean };

type BottomNavProps = {
  mode: 'bottom-nav';
  showLabel: boolean;
};

type Props = SidebarProps | BottomNavProps;

function useUserInitials() {
  const { data: user } = useRequiredCurrentUser();
  const [firstName, lastName] = user.name.split(' ') ?? [];
  const initials =
    firstName && lastName ? `${firstName[0]}${lastName[0]}` : 'A';

  return { user, initials };
}

function renderSidebarTrigger(
  userEmail: string | null,
  initials: string,
  imageUrl: string | null,
  isFull: boolean
): ReactNode {
  if (isFull) {
    return (
      <div className="flex w-full cursor-pointer items-center space-x-2 pl-2">
        <Avatar className="size-8">
          <AvatarImage src={imageUrl ?? undefined} alt={userEmail ?? 'User'} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="text-muted-foreground flex-grow truncate text-sm">
          {userEmail}
        </span>
        <Button variant="ghost" size="icon">
          <EllipsisVerticalIcon className="size-4 stroke-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Avatar className="size-8 cursor-pointer">
        <AvatarImage src={imageUrl ?? undefined} alt={userEmail ?? 'User'} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    </div>
  );
}

function renderBottomNavTrigger(
  userName: string | null,
  initials: string,
  imageUrl: string | null,
  showLabel: boolean
): ReactNode {
  return (
    <div className="flex-1">
      <button
        type="button"
        className="flex w-full cursor-pointer flex-col items-center gap-1"
      >
        <Avatar className="size-6">
          <AvatarImage src={imageUrl ?? undefined} alt={userName ?? 'User'} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {showLabel && <span className="text-[11px]">Account</span>}
      </button>
    </div>
  );
}

type AccountAction = {
  key: string;
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void | Promise<void>;
  children?: AccountActionChild[];
  childrenDescription?: string;
  childrenVariant?: 'option-grid';
  closeOnClick?: boolean;
  showsChevron?: boolean;
  tone?: 'default' | 'danger';
};

type AccountActionChild = {
  key: string;
  label: string;
  onClick: () => void | Promise<void>;
  isSelected?: boolean;
  mobileHint?: string;
  previewColor?: string;
  closeBeforeClick?: boolean;
};

function ActionChildLabel({ item }: { item: AccountActionChild }) {
  return (
    <span className="flex items-center gap-2 font-medium">
      {item.previewColor ? (
        <span
          className="border-border inline-block size-2.5 rounded-full border"
          style={{ backgroundColor: item.previewColor }}
        />
      ) : null}
      <span>{item.label}</span>
    </span>
  );
}

function AccountActionRow({
  action,
  onDone,
  onOpenChildren,
}: {
  action: AccountAction;
  onDone?: () => void;
  onOpenChildren?: (action: AccountAction) => void;
}) {
  const classes = cn(
    'flex w-full cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors',
    action.tone === 'danger'
      ? 'border-[var(--destructive-outline-border)] text-[var(--destructive-outline-foreground)] hover:bg-[var(--destructive-outline-hover)] hover:text-[var(--destructive-outline-hover-foreground)]'
      : 'border-border hover:bg-muted/60'
  );

  if (action.href) {
    return (
      <Link href={action.href} className={classes} onClick={onDone}>
        <span className="shrink-0">{action.icon}</span>
        <span className="flex-1 text-sm font-medium">{action.label}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      onClick={async () => {
        if (action.children) {
          onOpenChildren?.(action);
          return;
        }
        await action.onClick?.();
        if (action.closeOnClick !== false) {
          onDone?.();
        }
      }}
    >
      <span className="shrink-0">{action.icon}</span>
      <span className="flex-1 text-sm font-medium">{action.label}</span>
      {action.showsChevron && (
        <ChevronRightIcon className="size-4 shrink-0 opacity-60" />
      )}
    </button>
  );
}

function MobileChildActionGrid({
  items,
  onDone,
}: {
  items: AccountActionChild[];
  onDone?: () => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => {
        const isActive = item.isSelected;

        return (
          <button
            key={item.key}
            type="button"
            className={cn(
              'cursor-pointer rounded-2xl border px-3 py-2 text-left text-sm transition-colors',
              isActive
                ? 'bg-muted border border-[var(--shell-tint-600)]'
                : 'border-border hover:bg-muted/60'
            )}
            onClick={() => {
              void (async () => {
                if (item.closeBeforeClick) {
                  onDone?.();
                  await new Promise((resolve) => {
                    window.setTimeout(resolve, 260);
                  });
                }
                await item.onClick();
                if (!item.closeBeforeClick) {
                  onDone?.();
                }
              })();
            }}
          >
            <ActionChildLabel item={item} />
            <span className="text-muted-foreground block text-xs">
              {isActive ? 'Selected' : item.mobileHint}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function renderDesktopAccountAction(
  action: AccountAction,
  onDone?: () => void
) {
  const icon = <span className="mr-2 [&_svg]:size-4">{action.icon}</span>;

  if (action.children) {
    const selectedChild = action.children.find((child) => child.isSelected);

    return (
      <DropdownMenuSub key={action.key}>
        <DropdownMenuSubTrigger className="cursor-pointer gap-4">
          <span className="[&_svg]:size-4">{action.icon}</span>
          <span>{action.label}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="w-44">
          <DropdownMenuRadioGroup value={selectedChild?.key}>
            {action.children.map((child) => (
              <DropdownMenuRadioItem
                key={child.key}
                value={child.key}
                className="cursor-pointer"
                onSelect={(event) => {
                  event.preventDefault();
                  void (async () => {
                    await child.onClick();
                    onDone?.();
                  })();
                }}
              >
                <ActionChildLabel item={child} />
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    );
  }

  if (action.href) {
    return (
      <DropdownMenuItem key={action.key} className="cursor-pointer" asChild>
        <Link href={action.href} onClick={onDone}>
          {icon}
          <span>{action.label}</span>
        </Link>
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem
      key={action.key}
      className={cn(
        'cursor-pointer',
        action.tone === 'danger' &&
          'text-[var(--destructive-outline-foreground)] focus:text-[var(--destructive-outline-hover-foreground)]'
      )}
      onClick={() => {
        void action.onClick?.();
        if (action.closeOnClick !== false) {
          onDone?.();
        }
      }}
    >
      {icon}
      <span>{action.label}</span>
    </DropdownMenuItem>
  );
}

export default function UserButton(props: Props) {
  const { user, initials } = useUserInitials();
  const became = useBecameUser();
  const setBecameUser = useSetBecameUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileChildActionKey, setMobileChildActionKey] = useState<
    string | null
  >(null);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [sheetOffset, setSheetOffset] = useState(0);
  const [sheetHeight, setSheetHeight] = useState(0);
  const [isDraggingSheet, setIsDraggingSheet] = useState(false);
  const sheetContentRef = useRef<HTMLDivElement | null>(null);
  const dragStartYRef = useRef<number | null>(null);
  const dragStartOffsetRef = useRef(0);
  const activePointerIdRef = useRef<number | null>(null);
  const settleTimeoutRef = useRef<number | null>(null);
  const appearanceTimeoutRef = useRef<number | null>(null);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: ROOT_HREF });
  };

  const handleRevertSelf = async () => {
    await AirdevBackendApiClient.become(null);
    setBecameUser(null);
    window.location.reload();
  };

  const clearSettleTimeout = () => {
    if (settleTimeoutRef.current !== null) {
      window.clearTimeout(settleTimeoutRef.current);
      settleTimeoutRef.current = null;
    }
  };

  const clearAppearanceTimeout = () => {
    if (appearanceTimeoutRef.current !== null) {
      window.clearTimeout(appearanceTimeoutRef.current);
      appearanceTimeoutRef.current = null;
    }
  };

  const resetSheetDragState = () => {
    setIsDraggingSheet(false);
    dragStartYRef.current = null;
    dragStartOffsetRef.current = 0;
    activePointerIdRef.current = null;
  };

  const measureSheetHeight = () =>
    sheetContentRef.current?.getBoundingClientRect().height ?? 0;

  const animateSheetTo = (
    nextOffset: number,
    onComplete?: () => void,
    durationMs: number = 260
  ) => {
    clearSettleTimeout();
    setSheetOffset(nextOffset);
    if (!onComplete) {
      return;
    }
    settleTimeoutRef.current = window.setTimeout(() => {
      settleTimeoutRef.current = null;
      onComplete();
    }, durationMs);
  };

  const openMobileSheet = () => {
    clearSettleTimeout();
    setMobileOpen(true);
    resetSheetDragState();
    const initialOffset =
      typeof window === 'undefined' ? 0 : window.innerHeight;
    setSheetOffset(initialOffset);
  };

  const forceCloseMobileSheet = useCallback(() => {
    clearSettleTimeout();
    setMobileOpen(false);
    setMobileChildActionKey(null);
    setSheetOffset(0);
    setSheetHeight(0);
    resetSheetDragState();
  }, []);

  const forceCloseDesktopMenu = useCallback(() => {
    setDesktopOpen(false);
  }, []);

  const resetResponsiveUserMenu = useCallback(() => {
    forceCloseMobileSheet();
    forceCloseDesktopMenu();
  }, [forceCloseDesktopMenu, forceCloseMobileSheet]);

  const closeMobileSheet = () => {
    const currentHeight = measureSheetHeight() || sheetHeight;
    if (currentHeight <= 0) {
      forceCloseMobileSheet();
      return;
    }

    resetSheetDragState();
    animateSheetTo(currentHeight, () => {
      forceCloseMobileSheet();
    });
  };

  useEffect(
    () => () => {
      clearSettleTimeout();
      clearAppearanceTimeout();
    },
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const legacyMediaQuery = mediaQuery as MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    };
    const handleChange = () => {
      resetResponsiveUserMenu();
    };

    if ('addEventListener' in mediaQuery) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    legacyMediaQuery.addListener?.(handleChange);
    return () => legacyMediaQuery.removeListener?.(handleChange);
  }, [resetResponsiveUserMenu]);

  useEffect(() => {
    if (!mobileOpen) {
      setSheetHeight(0);
      return;
    }

    const measureAndAnimateOpen = () => {
      const nextHeight = measureSheetHeight();
      if (!nextHeight) {
        return;
      }
      setSheetHeight(nextHeight);
      setSheetOffset(0);
    };

    const frameId = window.requestAnimationFrame(measureAndAnimateOpen);
    const observer = new ResizeObserver(() => {
      const nextHeight = measureSheetHeight();
      if (nextHeight) {
        setSheetHeight(nextHeight);
      }
    });
    if (sheetContentRef.current) {
      observer.observe(sheetContentRef.current);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    sheetContentRef.current?.scrollTo({ top: 0 });
  }, [mobileOpen, mobileChildActionKey]);

  const handleSheetPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    clearSettleTimeout();
    setIsDraggingSheet(true);
    dragStartYRef.current = event.clientY;
    dragStartOffsetRef.current = sheetOffset;
    activePointerIdRef.current = event.pointerId;
  };

  const handleSheetPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      !isDraggingSheet ||
      dragStartYRef.current === null ||
      activePointerIdRef.current !== event.pointerId
    ) {
      return;
    }

    const nextOffset = Math.max(
      dragStartOffsetRef.current + (event.clientY - dragStartYRef.current),
      0
    );
    setSheetOffset(nextOffset);
  };

  const handleSheetPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      !isDraggingSheet ||
      (activePointerIdRef.current !== null &&
        activePointerIdRef.current !== event.pointerId)
    ) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const currentHeight = measureSheetHeight() || sheetHeight;
    const visibleRatio =
      currentHeight > 0 ? (currentHeight - sheetOffset) / currentHeight : 1;

    resetSheetDragState();

    if (currentHeight > 0 && visibleRatio < 0.75) {
      animateSheetTo(currentHeight, () => {
        setMobileOpen(false);
        setSheetOffset(0);
      });
      return;
    }

    animateSheetTo(0);
  };

  const openAppearanceDialog = (delayMs: number = 0) => {
    clearAppearanceTimeout();
    if (delayMs <= 0) {
      setAppearanceOpen(true);
      return;
    }

    appearanceTimeoutRef.current = window.setTimeout(() => {
      appearanceTimeoutRef.current = null;
      setAppearanceOpen(true);
    }, delayMs);
  };

  const accountActions: AccountAction[] = [
    ...(user.isAdmin
      ? [
          {
            key: 'admin',
            label: 'Admin',
            href: ADMIN_HREF,
            icon: <Wrench className="size-5" />,
          },
        ]
      : []),
    {
      key: 'appearance',
      label: 'Appearance',
      icon: <Palette className="size-5" />,
      closeOnClick: false,
      onClick: () => {
        if (props.mode === 'bottom-nav') {
          closeMobileSheet();
          openAppearanceDialog(280);
          return;
        }

        forceCloseDesktopMenu();
        openAppearanceDialog();
      },
    },
    {
      key: 'settings',
      label: 'Settings',
      href: SETTINGS_HREF,
      icon: <Cog6ToothIcon className="size-5" />,
    },
    // {
    //   key: 'mode',
    //   label: 'Mode',
    //   showsChevron: true,
    //   childrenDescription: 'Choose light, dark, or system mode',
    //   childrenVariant: 'option-grid',
    //   children: [
    //     {
    //       key: 'light',
    //       label: 'Light Mode',
    //       isSelected: activeThemeMode === 'light',
    //       mobileHint: 'Use light theme',
    //       closeBeforeClick: true,
    //       onClick: () => setTheme('light'),
    //     },
    //     {
    //       key: 'dark',
    //       label: 'Dark Mode',
    //       isSelected: activeThemeMode === 'dark',
    //       mobileHint: 'Use dark theme',
    //       closeBeforeClick: true,
    //       onClick: () => setTheme('dark'),
    //     },
    //     {
    //       key: 'system',
    //       label: 'System Mode',
    //       isSelected: activeThemeMode === 'system',
    //       mobileHint: 'Follow device theme',
    //       closeBeforeClick: true,
    //       onClick: () => setTheme('system'),
    //     },
    //   ],
    //   icon:
    //     activeThemeMode === 'dark' ? (
    //       <Moon className="size-5" />
    //     ) : activeThemeMode === 'system' ? (
    //       <Monitor className="size-5" />
    //     ) : (
    //       <Sun className="size-5" />
    //     ),
    // },
    // {
    //   key: 'theme',
    //   label: 'Theme',
    //   showsChevron: true,
    //   childrenDescription: 'Choose your shell color',
    //   childrenVariant: 'option-grid',
    //   children: shellColorOptions.map((option) => ({
    //     key: option.value,
    //     label: option.label,
    //     isSelected: option.value === shellColor,
    //     previewColor: SHELL_PREVIEW_COLORS[option.value],
    //     onClick: () => setShellColor(option.value),
    //   })),
    //   icon: <Palette className="size-5" />,
    // },
    became
      ? {
          key: 'revert',
          label: 'Revert to self',
          onClick: handleRevertSelf,
          icon: <LogOut className="size-5" />,
          tone: 'danger',
        }
      : {
          key: 'logout',
          label: 'Log out',
          onClick: handleSignOut,
          icon: <LogOut className="size-5" />,
          tone: 'danger',
        },
  ];

  const trigger =
    props.mode === 'sidebar'
      ? renderSidebarTrigger(user.name, initials, user.imageUrl, props.isFull)
      : renderBottomNavTrigger(
          user.name,
          initials,
          user.imageUrl,
          props.showLabel
        );

  const activeMobileChildAction =
    accountActions.find((action) => action.key === mobileChildActionKey) ??
    null;

  if (props.mode === 'bottom-nav') {
    const safeSheetHeight =
      sheetHeight ||
      sheetContentRef.current?.getBoundingClientRect().height ||
      1;
    const overlayOpacity = Math.max(
      0,
      Math.min(1, 1 - sheetOffset / safeSheetHeight)
    );

    return (
      <>
        <AppearanceDialog
          open={appearanceOpen}
          onOpenChange={setAppearanceOpen}
          showTrigger={false}
        />
        <BottomPopupSheet
          open={mobileOpen}
          onOpenChange={(open) => {
            if (open) {
              openMobileSheet();
              return;
            }
            closeMobileSheet();
          }}
        >
          <BottomPopupSheetTrigger asChild>{trigger}</BottomPopupSheetTrigger>
          <BottomPopupSheetContent
            ref={sheetContentRef}
            className="max-h-[88dvh] min-h-0 overflow-hidden rounded-t-3xl px-0"
            onRequestClose={closeMobileSheet}
            overlayStyle={{
              opacity: overlayOpacity,
              transition: isDraggingSheet
                ? 'none'
                : 'opacity 260ms cubic-bezier(0.4, 0, 1, 1)',
            }}
            style={{
              transform: `translateY(${sheetOffset}px)`,
              transition: isDraggingSheet
                ? 'none'
                : 'transform 260ms cubic-bezier(0.4, 0, 1, 1)',
            }}
          >
            <BottomPopupSheetHeader
              className="touch-none px-4 pt-5 pb-3"
              onPointerDown={handleSheetPointerDown}
              onPointerMove={handleSheetPointerMove}
              onPointerUp={handleSheetPointerEnd}
              onPointerCancel={handleSheetPointerEnd}
            >
              <div className="bg-muted mx-auto mb-3 h-1.5 w-12 rounded-full" />
              {activeMobileChildAction ? (
                <div className="relative flex min-h-11 items-center justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="iconSm"
                    className="absolute top-1/2 left-0 -translate-y-1/2"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => setMobileChildActionKey(null)}
                  >
                    <ArrowLeft className="size-4" />
                    <span className="sr-only">Back to account menu</span>
                  </Button>
                  <div className="px-8 text-center">
                    <BottomPopupSheetTitle>
                      {activeMobileChildAction.label}
                    </BottomPopupSheetTitle>
                    {activeMobileChildAction.childrenDescription && (
                      <BottomPopupSheetDescription>
                        {activeMobileChildAction.childrenDescription}
                      </BottomPopupSheetDescription>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Avatar className="size-11">
                    <AvatarImage
                      src={user.imageUrl ?? undefined}
                      alt={user.name ?? 'User'}
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <BottomPopupSheetTitle className="truncate">
                      {user.name}
                    </BottomPopupSheetTitle>
                    <BottomPopupSheetDescription className="truncate">
                      {user.email}
                    </BottomPopupSheetDescription>
                  </div>
                </div>
              )}
            </BottomPopupSheetHeader>
            <div className="space-y-3 px-4 pb-4">
              {activeMobileChildAction?.children &&
              activeMobileChildAction.childrenVariant === 'option-grid' ? (
                <MobileChildActionGrid
                  items={activeMobileChildAction.children}
                  onDone={closeMobileSheet}
                />
              ) : (
                accountActions.map((action) => (
                  <AccountActionRow
                    key={action.key}
                    action={action}
                    onDone={closeMobileSheet}
                    onOpenChildren={(nextAction) =>
                      setMobileChildActionKey(nextAction.key)
                    }
                  />
                ))
              )}
            </div>
          </BottomPopupSheetContent>
        </BottomPopupSheet>
      </>
    );
  }

  const sideOffset = props.isFull ? 12 : 16;
  const standardActions = accountActions.filter(
    (action) => action.tone !== 'danger'
  );
  const dangerActions = accountActions.filter(
    (action) => action.tone === 'danger'
  );

  return (
    <>
      <AppearanceDialog
        open={appearanceOpen}
        onOpenChange={setAppearanceOpen}
        showTrigger={false}
      />
      <DropdownMenu open={desktopOpen} onOpenChange={setDesktopOpen}>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          side="right"
          align="end"
          alignOffset={0}
          sideOffset={sideOffset}
        >
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {standardActions.map((action) =>
            renderDesktopAccountAction(action, forceCloseDesktopMenu)
          )}
          {dangerActions.length > 0 && <DropdownMenuSeparator />}
          {dangerActions.map((action) =>
            renderDesktopAccountAction(action, forceCloseDesktopMenu)
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

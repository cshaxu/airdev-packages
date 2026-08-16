/* "@airdev/next": "managed" */

'use client';

import { cn } from '@/airdev/frontend/utils/cn';
import * as React from 'react';
import { Button } from './Button';

type SharedButtonProps = React.ComponentProps<typeof Button>;

type BottomBarProps = React.HTMLAttributes<HTMLDivElement> & {
  left?: React.ReactNode;
  middle?: React.ReactNode;
  right?: React.ReactNode;
  sticky?: boolean;
  innerClassName?: string;
};

type BottomBarGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  align?: 'start' | 'center' | 'end';
  priority?: 'side' | 'middle';
};

type BottomBarButtonContentProps = {
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  shortLabel?: React.ReactNode;
  longLabel?: React.ReactNode;
  screenReaderLabel?: string;
  labelsClassName?: string;
  shortLabelClassName?: string;
  longLabelClassName?: string;
};

type BottomBarButtonProps = Omit<SharedButtonProps, 'children'> &
  BottomBarButtonContentProps;

function middleOutsideInRounds<T>(items: T[]) {
  const rounds: T[][] = [];
  let leftIndex = 0;
  let rightIndex = items.length - 1;

  while (leftIndex <= rightIndex) {
    const round = [items[leftIndex]];
    if (rightIndex !== leftIndex) {
      round.push(items[rightIndex]);
    }
    rounds.push(round);
    leftIndex += 1;
    rightIndex -= 1;
  }

  return rounds;
}

function interleave<T>(left: T[], right: T[]) {
  const ordered: T[] = [];
  const maxLength = Math.max(left.length, right.length);

  for (let index = 0; index < maxLength; index += 1) {
    if (index < left.length) {
      ordered.push(left[index]);
    }
    if (index < right.length) {
      ordered.push(right[index]);
    }
  }

  return ordered;
}

function sideOutsideInRounds<T>(leftItems: T[], rightItems: T[]) {
  return interleave(leftItems, [...rightItems].reverse()).reduce<T[][]>(
    (rounds, item, index) => {
      const roundIndex = Math.floor(index / 2);
      if (!rounds[roundIndex]) {
        rounds[roundIndex] = [];
      }

      rounds[roundIndex].push(item);
      return rounds;
    },
    []
  );
}

export function BottomBar({
  left,
  middle,
  right,
  sticky = false,
  className,
  innerClassName,
  children,
  ...props
}: BottomBarProps) {
  const innerRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const root = innerRef.current;
    if (!root) {
      return;
    }

    const compactableSelector =
      '[data-bottom-bar-button="true"][data-can-compact="true"]';

    const getGroup = (role: 'left' | 'middle' | 'right') =>
      root.querySelector<HTMLElement>(`[data-bottom-bar-group="${role}"]`);

    const setCompactState = (button: HTMLElement, compact: boolean) => {
      button.dataset.compact = compact ? 'true' : 'false';
    };

    const measureButtonWidth = (
      button: HTMLElement,
      mode: 'expanded' | 'compact'
    ) => {
      const previousCompact = button.dataset.compact;
      const previousMeasureCompact = button.dataset.measureCompact;

      button.dataset.compact = mode === 'compact' ? 'true' : 'false';
      if (mode === 'compact') {
        button.dataset.measureCompact = 'true';
      } else {
        delete button.dataset.measureCompact;
      }

      const width = button.offsetWidth;

      if (previousCompact === undefined) {
        delete button.dataset.compact;
      } else {
        button.dataset.compact = previousCompact;
      }

      if (previousMeasureCompact === undefined) {
        delete button.dataset.measureCompact;
      } else {
        button.dataset.measureCompact = previousMeasureCompact;
      }

      return width;
    };

    const updateCompactState = () => {
      const leftGroup = getGroup('left');
      const middleGroup = getGroup('middle');
      const rightGroup = getGroup('right');

      [leftGroup, middleGroup, rightGroup].forEach((group) => {
        if (!group) {
          return;
        }

        group.style.flex = '';
        group.style.minWidth = '';
        group.style.width = '';
      });

      const getButtons = (group: HTMLElement | null) =>
        group
          ? Array.from(group.querySelectorAll<HTMLElement>(compactableSelector))
          : [];

      const leftButtons = getButtons(leftGroup);
      const middleButtons = getButtons(middleGroup);
      const rightButtons = getButtons(rightGroup);

      const sideSteps = sideOutsideInRounds(leftButtons, rightButtons);
      const middleSteps = middleOutsideInRounds(middleButtons);
      const compactionSteps = [...sideSteps, ...middleSteps];

      compactionSteps
        .flat()
        .forEach((button) => setCompactState(button, false));

      const buttonWidths = new Map<
        HTMLElement,
        { expanded: number; compact: number }
      >();

      compactionSteps.flat().forEach((button) => {
        buttonWidths.set(button, {
          expanded: measureButtonWidth(button, 'expanded'),
          compact: measureButtonWidth(button, 'compact'),
        });
      });

      const measureGroupWidth = (group: HTMLElement | null) => {
        if (!group) {
          return 0;
        }

        const children = Array.from(group.children) as HTMLElement[];
        if (children.length === 0) {
          return 0;
        }

        const style = window.getComputedStyle(group);
        const gap = Number.parseFloat(style.columnGap || style.gap || '0') || 0;

        return (
          children.reduce((sum, child) => {
            const widths = buttonWidths.get(child);
            if (widths) {
              return (
                sum +
                (child.dataset.compact === 'true'
                  ? widths.compact
                  : widths.expanded)
              );
            }

            return sum + child.offsetWidth;
          }, 0) +
          gap * Math.max(children.length - 1, 0)
        );
      };

      const measureGroupMinWidth = (group: HTMLElement | null) => {
        if (!group) {
          return 0;
        }

        const children = Array.from(group.children) as HTMLElement[];
        if (children.length === 0) {
          return 0;
        }

        const style = window.getComputedStyle(group);
        const gap = Number.parseFloat(style.columnGap || style.gap || '0') || 0;

        return (
          children.reduce((sum, child) => {
            const widths = buttonWidths.get(child);
            if (!widths) {
              return sum + child.offsetWidth;
            }

            return sum + Math.min(widths.expanded, widths.compact);
          }, 0) +
          gap * Math.max(children.length - 1, 0)
        );
      };

      const hasContent = (group: HTMLElement | null) =>
        Boolean(group && group.children.length > 0);

      const setSideGroupWidths = (sharedSideWidth: number) => {
        const hasSideContent = hasContent(leftGroup) || hasContent(rightGroup);

        [leftGroup, rightGroup].forEach((group) => {
          if (!group) {
            return;
          }

          if (!hasSideContent || sharedSideWidth <= 0) {
            group.style.flex = '';
            group.style.minWidth = '';
            group.style.width = '';
            return;
          }

          group.style.flex = `0 0 ${sharedSideWidth}px`;
          group.style.minWidth = `${sharedSideWidth}px`;
          group.style.width = `${sharedSideWidth}px`;
        });

        if (middleGroup) {
          middleGroup.style.flex = '1 1 auto';
          middleGroup.style.minWidth = '0';
          middleGroup.style.width = '';
        }
      };

      const containerStyle = window.getComputedStyle(root);
      const containerGap =
        Number.parseFloat(
          containerStyle.columnGap || containerStyle.gap || '0'
        ) || 0;
      const availableWidth =
        root.clientWidth -
        (Number.parseFloat(containerStyle.paddingLeft || '0') || 0) -
        (Number.parseFloat(containerStyle.paddingRight || '0') || 0);

      const totalRequiredWidth = (sharedSideWidth: number) => {
        const middleWidth = measureGroupWidth(middleGroup);
        const nonEmptyGroups = [
          hasContent(leftGroup) ? sharedSideWidth : 0,
          hasContent(middleGroup) ? middleWidth : 0,
          hasContent(rightGroup) ? sharedSideWidth : 0,
        ].filter((width) => width > 0).length;

        return (
          (hasContent(leftGroup) ? sharedSideWidth : 0) +
          (hasContent(middleGroup) ? middleWidth : 0) +
          (hasContent(rightGroup) ? sharedSideWidth : 0) +
          containerGap * Math.max(nonEmptyGroups - 1, 0)
        );
      };

      const canReduceWidth = (button: HTMLElement) => {
        const widths = buttonWidths.get(button);
        return widths !== undefined && widths.compact < widths.expanded;
      };

      const currentSharedSideWidth = () =>
        Math.max(measureGroupWidth(leftGroup), measureGroupWidth(rightGroup));

      const reservedSideWidth = Math.max(
        measureGroupMinWidth(leftGroup),
        measureGroupMinWidth(rightGroup)
      );

      let sharedSideWidth = currentSharedSideWidth();
      setSideGroupWidths(sharedSideWidth);

      for (const step of sideSteps) {
        if (totalRequiredWidth(sharedSideWidth) <= availableWidth + 1) {
          break;
        }

        const compactableButtons = step.filter(canReduceWidth);

        compactableButtons.forEach((button) => {
          setCompactState(button, true);
        });

        sharedSideWidth = currentSharedSideWidth();
        setSideGroupWidths(sharedSideWidth);
      }

      const needsMiddleCompaction =
        hasContent(middleGroup) &&
        totalRequiredWidth(reservedSideWidth) > availableWidth + 1;

      if (needsMiddleCompaction) {
        sharedSideWidth = reservedSideWidth;
        setSideGroupWidths(sharedSideWidth);

        for (const step of middleSteps) {
          if (totalRequiredWidth(sharedSideWidth) <= availableWidth + 1) {
            break;
          }

          const compactableButtons = step.filter(canReduceWidth);

          compactableButtons.forEach((button) => {
            setCompactState(button, true);
          });

          setSideGroupWidths(sharedSideWidth);
        }
      }
    };

    updateCompactState();

    const observer = new ResizeObserver(() => {
      updateCompactState();
    });

    observer.observe(root);
    Array.from(
      root.querySelectorAll<HTMLElement>('[data-bottom-bar-group]')
    ).forEach((group) => observer.observe(group));
    Array.from(
      root.querySelectorAll<HTMLElement>('[data-bottom-bar-button="true"]')
    ).forEach((button) => observer.observe(button));

    return () => observer.disconnect();
  }, [left, middle, right, children]);

  return (
    <div
      className={cn(
        'bg-background/95 supports-[backdrop-filter]:bg-background/80 border-border shrink-0 border-t backdrop-blur',
        sticky && 'sticky bottom-0 z-20',
        className
      )}
      {...props}
    >
      <div
        ref={innerRef}
        className={cn(
          'mx-auto flex w-full items-center gap-3 p-4',
          innerClassName
        )}
      >
        <BottomBarGroup align="start" priority="side">
          {left}
        </BottomBarGroup>
        <BottomBarGroup align="center" priority="middle">
          {middle ?? children}
        </BottomBarGroup>
        <BottomBarGroup align="end" priority="side">
          {right}
        </BottomBarGroup>
      </div>
    </div>
  );
}

export function BottomBarGroup({
  align = 'start',
  priority = 'side',
  className,
  children,
  ...props
}: BottomBarGroupProps) {
  return (
    <div
      data-bottom-bar-group={
        align === 'start' ? 'left' : align === 'center' ? 'middle' : 'right'
      }
      className={cn(
        'group/bottom-bar-group flex min-w-0 flex-nowrap items-center gap-2 overflow-hidden',
        priority === 'side' && 'flex-1 basis-0',
        priority === 'middle' && 'shrink-0',
        align === 'start' && 'justify-start',
        align === 'center' && 'justify-center',
        align === 'end' && 'justify-end',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function BottomBarButtonContent({
  icon,
  iconPosition = 'start',
  shortLabel,
  longLabel,
  screenReaderLabel,
  labelsClassName,
  shortLabelClassName,
  longLabelClassName,
}: BottomBarButtonContentProps) {
  const desktopLabel = longLabel ?? shortLabel ?? null;
  const mobileLabel =
    shortLabel !== undefined ? shortLabel : icon ? null : desktopLabel;
  const showsResponsiveLabels =
    longLabel !== undefined || shortLabel !== undefined;

  return (
    <>
      {iconPosition === 'start' ? icon : null}

      {showsResponsiveLabels ? (
        <>
          {mobileLabel !== null ? (
            <span
              className={cn(
                'hidden group-data-[compact=true]/bottom-bar-button:inline group-data-[measure-compact=true]/bottom-bar-button:inline',
                labelsClassName,
                shortLabelClassName
              )}
            >
              {mobileLabel}
            </span>
          ) : null}

          {desktopLabel !== null ? (
            <span
              className={cn(
                'inline group-data-[compact=true]/bottom-bar-button:hidden group-data-[measure-compact=true]/bottom-bar-button:hidden',
                labelsClassName,
                longLabelClassName
              )}
            >
              {desktopLabel}
            </span>
          ) : null}
        </>
      ) : desktopLabel !== null ? (
        <span className={cn(labelsClassName, longLabelClassName)}>
          {desktopLabel}
        </span>
      ) : null}

      {screenReaderLabel ? (
        <span className="sr-only">{screenReaderLabel}</span>
      ) : null}

      {iconPosition === 'end' ? icon : null}
    </>
  );
}

export function BottomBarButton({
  icon,
  iconPosition,
  className,
  shortLabel,
  longLabel,
  screenReaderLabel,
  title,
  ...props
}: BottomBarButtonProps) {
  const srLabel =
    screenReaderLabel ?? (typeof title === 'string' ? title : undefined);

  return (
    <Button
      title={title}
      data-bottom-bar-button="true"
      data-can-compact={shortLabel !== undefined || icon !== undefined}
      className={cn(
        className,
        'group/bottom-bar-button shrink-0 data-[compact=true]:aspect-square data-[compact=true]:w-auto data-[compact=true]:min-w-0 data-[compact=true]:shrink-0 data-[compact=true]:justify-center data-[compact=true]:rounded-full data-[compact=true]:px-0'
      )}
      {...props}
    >
      <BottomBarButtonContent
        icon={icon}
        iconPosition={iconPosition}
        shortLabel={shortLabel}
        longLabel={longLabel}
        screenReaderLabel={srLabel}
      />
    </Button>
  );
}

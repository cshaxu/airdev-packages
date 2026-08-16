/* "@airdev/next": "managed" */

'use client';

import { MOBILE_FULLSCREEN_DATASET_KEY } from '@/airdev/common/constant';
import { cn } from '@/airdev/frontend/utils/cn';
import * as React from 'react';
import { BottomBar } from './BottomBar';
import ProgressBar from './ProgressBar';

type ProgressShellProps = { value: number; max?: number };

type BottomShellProps = {
  left?: React.ReactNode;
  middle?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
  innerClassName?: string;
};

type FlowStepViewProps = React.HTMLAttributes<HTMLDivElement> & {
  progress: ProgressShellProps;
  contentClassName?: string;
  contentInnerClassName?: string;
  bottom?: BottomShellProps;
  mobileFullscreen?: boolean;
};

export default function FlowStepView({
  progress,
  contentClassName,
  contentInnerClassName,
  bottom,
  mobileFullscreen = false,
  className,
  children,
  ...props
}: FlowStepViewProps) {
  React.useEffect(() => {
    if (!mobileFullscreen) {
      return;
    }

    document.body.dataset[MOBILE_FULLSCREEN_DATASET_KEY] = 'true';
    document.documentElement.dataset[MOBILE_FULLSCREEN_DATASET_KEY] = 'true';

    return () => {
      delete document.body.dataset[MOBILE_FULLSCREEN_DATASET_KEY];
      delete document.documentElement.dataset[MOBILE_FULLSCREEN_DATASET_KEY];
    };
  }, [mobileFullscreen]);

  return (
    <div
      className={cn(
        'flex h-full min-h-0 w-full flex-col overflow-hidden',
        className
      )}
      {...props}
    >
      <ProgressBar value={progress.value} max={progress.max} />

      <div
        className={cn(
          'min-h-0 flex-1 overflow-x-hidden overflow-y-auto',
          contentClassName
        )}
      >
        <div className={cn('mx-auto w-full min-w-0', contentInnerClassName)}>
          {children}
        </div>
      </div>

      {bottom ? (
        <BottomBar
          left={bottom.left}
          middle={bottom.middle}
          right={bottom.right}
          className={bottom.className}
          innerClassName={bottom.innerClassName}
        />
      ) : null}
    </div>
  );
}

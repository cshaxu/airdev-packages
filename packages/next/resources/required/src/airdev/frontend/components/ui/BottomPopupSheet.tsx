/* "@airdev/next": "managed" */

'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/airdev/frontend/utils/cn';

function BottomPopupSheet(
  props: React.ComponentProps<typeof DialogPrimitive.Root>
) {
  return <DialogPrimitive.Root data-slot="bottom-popup-sheet" {...props} />;
}

function BottomPopupSheetTrigger(
  props: React.ComponentProps<typeof DialogPrimitive.Trigger>
) {
  return (
    <DialogPrimitive.Trigger
      data-slot="bottom-popup-sheet-trigger"
      {...props}
    />
  );
}

function BottomPopupSheetClose(
  props: React.ComponentProps<typeof DialogPrimitive.Close>
) {
  return (
    <DialogPrimitive.Close data-slot="bottom-popup-sheet-close" {...props} />
  );
}

const BottomPopupSheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentProps<typeof DialogPrimitive.Content> & {
    overlayClassName?: string;
    overlayStyle?: React.CSSProperties;
    onRequestClose?: () => void;
  }
>(
  (
    {
      className,
      children,
      overlayClassName,
      overlayStyle,
      onRequestClose,
      ...props
    },
    ref
  ) => {
    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          data-slot="bottom-popup-sheet-overlay"
          className={cn(
            'fixed inset-0 z-50 bg-[var(--overlay-backdrop)]',
            overlayClassName
          )}
          style={overlayStyle}
        />
        <DialogPrimitive.Content
          ref={ref}
          data-slot="bottom-popup-sheet-content"
          className={cn(
            'bg-background fixed inset-x-0 bottom-0 z-50 flex flex-col gap-4 border-t shadow-lg',
            className
          )}
          {...props}
        >
          {children}
          <button
            type="button"
            onClick={onRequestClose}
            className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
          >
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  }
);
BottomPopupSheetContent.displayName = 'BottomPopupSheetContent';

function BottomPopupSheetHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="bottom-popup-sheet-header"
      className={cn('flex flex-col gap-1.5 p-4', className)}
      {...props}
    />
  );
}

function BottomPopupSheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="bottom-popup-sheet-title"
      className={cn('text-foreground font-semibold', className)}
      {...props}
    />
  );
}

function BottomPopupSheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="bottom-popup-sheet-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

export {
  BottomPopupSheet,
  BottomPopupSheetClose,
  BottomPopupSheetContent,
  BottomPopupSheetDescription,
  BottomPopupSheetHeader,
  BottomPopupSheetTitle,
  BottomPopupSheetTrigger,
};

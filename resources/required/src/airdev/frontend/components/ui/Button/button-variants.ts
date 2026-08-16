/* "@airdev/next": "managed" */

import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--button-default-bg)] text-[var(--button-default-foreground)] hover:bg-[var(--button-default-hover)] disabled:bg-[var(--button-default-disabled)] disabled:text-[var(--button-default-disabled-foreground)]',
        destructive:
          'bg-[var(--button-destructive-bg)] text-[var(--button-destructive-foreground)] hover:bg-[var(--button-destructive-hover)] disabled:bg-[var(--button-destructive-disabled)] disabled:text-[var(--button-destructive-disabled-foreground)]',
        outline:
          'border bg-[var(--button-outline-bg)] border-[var(--button-outline-border)] text-[var(--button-outline-foreground)] hover:bg-[var(--button-outline-hover)] hover:text-[var(--button-outline-hover-foreground)] disabled:text-[var(--button-outline-disabled-foreground)]',
        secondary:
          'bg-[var(--button-secondary-bg)] text-[var(--button-secondary-foreground)] hover:bg-[var(--button-secondary-hover)] disabled:bg-[var(--button-secondary-disabled)] disabled:text-[var(--button-secondary-disabled-foreground)]',
        ghost:
          'text-[var(--button-ghost-foreground)] hover:bg-[var(--button-ghost-hover)] hover:text-[var(--button-ghost-hover-foreground)] disabled:text-[var(--button-ghost-disabled-foreground)]',
        link: 'text-[var(--button-link-foreground)] underline-offset-4 hover:text-[var(--button-link-hover-foreground)] hover:underline disabled:text-[var(--button-link-disabled-foreground)]',
      },
      size: {
        default: 'h-9 px-4 py-2 text-sm font-medium',
        xs: 'h-7 px-2 text-xs font-medium',
        sm: 'h-8 px-3 text-xs font-medium',
        lg: 'h-10 px-8 text-base font-medium',
        xl: 'h-12 px-10 text-base font-bold',
        icon: 'size-9',
        iconSm: 'size-7',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

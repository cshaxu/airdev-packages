/* "@airdev/next": "managed" */

'use client';

import { airdevPublicConfig } from '@/airdev/config/public';
import GoogleLogo from '@/airdev/frontend/components/GoogleLogo';
import { Button } from '@/airdev/frontend/components/ui/Button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/airdev/frontend/components/ui/Dialog';
import { ArrowRight } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { ComponentProps, ReactNode } from 'react';

type Props = {
  triggerClassName?: string;
  triggerLabelClassName?: string;
  triggerLabel?: string;
  compactTriggerLabel?: string;
  callbackUrl?: string;
  buttonVariant?: ComponentProps<typeof Button>['variant'];
  title?: string;
  description?: ReactNode;
};

export default function GetStartedDialog({
  triggerClassName,
  triggerLabelClassName,
  triggerLabel = 'Get started',
  compactTriggerLabel,
  callbackUrl = '/dashboard',
  buttonVariant,
  title,
  description = <>Sign in to start using the workspace immediately.</>,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={triggerClassName} variant={buttonVariant}>
          {compactTriggerLabel ? (
            <>
              <span
                className={`min-[521px]:hidden ${triggerLabelClassName ?? ''}`.trim()}
              >
                {compactTriggerLabel}
              </span>
              <span
                className={`max-[520px]:hidden ${triggerLabelClassName ?? ''}`.trim()}
              >
                {triggerLabel}
              </span>
            </>
          ) : (
            <span className={triggerLabelClassName}>{triggerLabel}</span>
          )}
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[430px]">
        <DialogHeader>
          <DialogTitle>
            {title ?? `Welcome to ${airdevPublicConfig.app.name}`}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogBody className="flex flex-col gap-4">
          <Button
            variant="outline"
            size="lg"
            className="h-12 rounded-2xl"
            onClick={() => signIn('google', { callbackUrl })}
          >
            <GoogleLogo className="mr-2 size-5" />
            Continue with Google
          </Button>

          <small className="text-muted-foreground text-center text-xs leading-5">
            Powered by {airdevPublicConfig.app.ownerShort}. By signing in, you
            agree to the{' '}
            <Link href="/terms" className="underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </small>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

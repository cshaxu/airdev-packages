/* "@airdev/next": "managed" */

'use client';

import { airdevPublicConfig } from '@/airdev/config/public';
import { ReactNodeProps } from '@/airdev/frontend/types/props';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function SignInLayout({ children }: ReactNodeProps) {
  return (
    <div className="grid h-screen w-full grid-cols-2 gap-4 overflow-hidden p-4 lg:p-6 [@media(orientation:portrait)]:grid-cols-1 [@media(orientation:portrait)]:overflow-y-auto [@media(orientation:portrait)]:p-3 sm:[@media(orientation:portrait)]:p-4">
      <div
        className="flex min-h-0 flex-col items-center justify-between overflow-hidden rounded-3xl px-6 pt-10 pb-6 text-center sm:px-8 lg:px-10 lg:pt-24 lg:pb-8 [@media(orientation:portrait)]:min-h-[14rem] [@media(orientation:portrait)]:px-5 [@media(orientation:portrait)]:pt-8 [@media(orientation:portrait)]:pb-6 sm:[@media(orientation:portrait)]:min-h-[18rem] sm:[@media(orientation:portrait)]:px-8 sm:[@media(orientation:portrait)]:pt-12"
        style={{
          background:
            'radial-gradient(circle, var(--shell-auth-gradient-start) 0%, var(--shell-auth-gradient-end) 70%)',
        }}
      >
        <div className="flex w-full max-w-md flex-col gap-y-4">
          <div className="flex w-full justify-start">
            <Image
              src="/airdev/clipboard.svg"
              alt="clipboard"
              width={72}
              height={72}
              className="h-16 w-16 sm:h-[88px] sm:w-[88px] lg:h-[100px] lg:w-[100px]"
            />
          </div>
          <div className="flex w-full justify-end">
            <Sparkles className="size-6 text-[var(--shell-auth-foreground)]" />
          </div>
          <h1 className="text-2xl font-medium text-[var(--shell-auth-foreground)] sm:text-3xl">
            Welcome to {airdevPublicConfig.app.name}
          </h1>
          <p className="text-sm leading-6 text-[var(--shell-auth-foreground)] sm:text-base">
            {airdevPublicConfig.app.welcomeText}
          </p>
        </div>
        <div className="mt-6 flex w-full justify-start lg:mt-10">
          <Image
            src="/airdev/math.svg"
            alt="math-symbols"
            width={209}
            height={209}
            loading="eager"
            className="h-24 w-24 sm:h-36 sm:w-36 lg:h-[209px] lg:w-[209px]"
          />
        </div>
      </div>

      <div className="grid place-items-center [@media(orientation:portrait)]:items-start">
        <div className="[@media(orientation:portrait)]:bg-background/90 w-full max-w-md [@media(orientation:portrait)]:rounded-3xl [@media(orientation:portrait)]:border [@media(orientation:portrait)]:border-[var(--shell-tint-100)] [@media(orientation:portrait)]:p-5 [@media(orientation:portrait)]:shadow-sm sm:[@media(orientation:portrait)]:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/* "@airdev/next": "managed" */

import { PRIVACY_HREF, ROOT_HREF, TERMS_HREF } from '@/airdev/common/constant';
import { airdevPublicConfig } from '@/airdev/config/public';
import Image from 'next/image';
import Link from 'next/link';

const productLinks = [
  { href: '#overview', label: 'Overview' },
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
];

const connectLinks = [
  {
    href: `mailto:${airdevPublicConfig.app.email}`,
    label: airdevPublicConfig.app.email,
    external: true,
  },
];

const stuffLinks = [
  { href: TERMS_HREF, label: 'Terms of Service' },
  { href: PRIVACY_HREF, label: 'Privacy Policy' },
];

export default function Footer() {
  return (
    <footer className="bg-background/80 w-full border-t border-[var(--shell-tint-100)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-y-16 px-4 py-12 md:px-8">
        <div className="flex flex-wrap gap-16">
          <div className="w-full md:max-w-xs">
            <Link href={ROOT_HREF} className="flex items-center gap-3">
              <Image
                src={airdevPublicConfig.shell.assets.logoSrc}
                alt={airdevPublicConfig.app.name}
                width={36}
                height={36}
              />
              <span className="text-lg font-semibold tracking-tight">
                {airdevPublicConfig.app.name}
              </span>
            </Link>
            <p className="text-muted-foreground mt-2">
              {airdevPublicConfig.app.description}
            </p>
          </div>

          <div className="md:mr-8">
            <h3 className="mb-4 text-lg font-medium">Product</h3>
            <ul className="flex flex-col gap-y-2">
              {productLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:mr-8">
            <h3 className="mb-4 text-lg font-medium">Connect</h3>
            <ul className="flex flex-col gap-y-2">
              {connectLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    className="hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Stuff</h3>
            <ul className="flex flex-col gap-y-2">
              {stuffLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground mt-8 text-sm">
              &copy; {new Date().getFullYear()} {airdevPublicConfig.app.owner}.
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

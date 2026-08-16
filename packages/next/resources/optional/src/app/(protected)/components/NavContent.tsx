/* "@airdev/next": "seeded" */

'use client';

import { LayoutDashboard } from 'lucide-react';

type IconRenderer = (className: string) => React.ReactNode;
type PathMatcher = (pathname: string) => boolean;

export type NavItem = {
  key: string;
  label: string;
  to: string;
  isActive: PathMatcher;
  renderIcon: IconRenderer;
};

const startsWith =
  (prefix: string): PathMatcher =>
  (pathname) =>
    pathname.startsWith(prefix);

const navItems: NavItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    to: '/dashboard',
    isActive: startsWith('/dashboard'),
    renderIcon: (className) => <LayoutDashboard className={className} />,
  },
];

export default function NavContent() {
  return { navItems };
}

/* "@airdev/next": "managed" */

import RootLayout, {
  generateRootLayoutMetadata,
} from '@/airdev/frontend/components/shell/RootLayout';
import { ReactNodeProps } from '@/airdev/frontend/types/props';

export const generateMetadata = generateRootLayoutMetadata;

export default async function Layout({ children }: ReactNodeProps) {
  return <RootLayout>{children}</RootLayout>;
}

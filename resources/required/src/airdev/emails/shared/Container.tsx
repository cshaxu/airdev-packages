/* "@airdev/next": "managed" */

import { EMAIL_THEME } from '@/airdev/common/theme';
import { ReactNodeProps } from '@/airdev/frontend/types/props';
import { Container as ReactEmailContainer } from '@react-email/components';

export default function Container({ children }: ReactNodeProps) {
  return (
    <ReactEmailContainer
      style={{
        backgroundColor: EMAIL_THEME.background,
        borderRadius: '24px',
        border: `1px solid ${EMAIL_THEME.border}`,
        padding: '2rem 1rem',
      }}
    >
      {children}
    </ReactEmailContainer>
  );
}

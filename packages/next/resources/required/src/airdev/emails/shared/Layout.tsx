/* "@airdev/next": "managed" */

import { EMAIL_THEME } from '@/airdev/common/theme';
import { airdevPublicConfig } from '@/airdev/config/public';
import { ReactNodeProps } from '@/airdev/frontend/types/props';
import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components';

type Payload = ReactNodeProps & { preview: string; isBroadcast: boolean };

export default function Layout({ preview, isBroadcast, children }: Payload) {
  return (
    <Html>
      <Head>
        <style>
          {`
              .body {
                background-color: ${EMAIL_THEME.background};
              }
          `}
        </style>
      </Head>
      <Preview>{preview}</Preview>
      <Tailwind
        config={{ theme: { extend: { fontSize: { base: ['1rem', '1.75'] } } } }}
      >
        <Body
          className="body px-2 py-10"
          style={{
            color: EMAIL_THEME.foreground,
            fontFamily: '"Open Sans", Helvetica, Arial, sans-serif',
          }}
        >
          {children}
          <Container className="mt-10">
            {/* <Img
              src="/"
              alt={publicConfig.app.name}
              className="mx-auto"
              width={48}
              height={40}
            /> */}
            {isBroadcast && (
              <Text className="text-center">
                <Link
                  href={`${airdevPublicConfig.service.baseUrl}/notification-settings`}
                  className="underline"
                  style={{ color: EMAIL_THEME.link }}
                >
                  Notification Settings
                </Link>
              </Text>
            )}
            <Text className="text-center" style={{ color: EMAIL_THEME.muted }}>
              © {new Date().getFullYear()}{' '}
              <Link
                className="underline"
                style={{ color: EMAIL_THEME.link }}
                href={airdevPublicConfig.service.baseUrl}
              >
                {airdevPublicConfig.app.owner}
              </Link>
              . All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

/* "@airdev/next": "managed" */

import { HEADER_CURRENT_USER_ID_KEY } from '@/airdev/common/constant';
import { BecomeBody } from '@/airdev/common/types/context';
import { airdevPrivateConfig } from '@/airdev/config/private';
import { airdevPublicConfig } from '@/airdev/config/public';
import { CommonResponse } from '@airent/api';
import { NextRequest, NextResponse } from 'next/server';

async function become(
  request: NextRequest
): Promise<NextResponse<CommonResponse<BecomeBody, Error>>> {
  const { userId } = await request.json();
  const response = NextResponse.json(
    { code: 200, data: { userId } },
    { status: 200 }
  );
  const isServiceLocal =
    airdevPublicConfig.service.serviceEnvironment === 'local';
  // become user
  if (userId === null) {
    response.cookies.delete({
      name: HEADER_CURRENT_USER_ID_KEY,
      path: '/',
    });
  } else {
    response.cookies.set({
      name: HEADER_CURRENT_USER_ID_KEY,
      value: userId,
      httpOnly: true,
      maxAge: airdevPrivateConfig.nextauth.sessionMaxAge,
      path: '/',
      sameSite: isServiceLocal ? 'lax' : 'none',
      secure: !isServiceLocal,
    });
  }
  return response;
}

const AuthService = { become };

export default AuthService;

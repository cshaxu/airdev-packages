/* "@airdev/next": "managed" */

'use client';

import { parseAsString, useQueryState } from 'nuqs';
import { useState } from 'react';
import SignInStart from './SignInStart';
import SignInVerify from './SignInVerify';

export default function SignInSteps() {
  const [step] = useQueryState('step', parseAsString.withDefault('1'));
  const [email, setEmail] = useState<string>();

  if (step === '1' || email === undefined) {
    return <SignInStart setEmail={setEmail} />;
  }

  if (step === '2') {
    return <SignInVerify email={email} />;
  }

  return null;
}

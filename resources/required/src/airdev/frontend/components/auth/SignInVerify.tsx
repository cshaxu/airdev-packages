/* "@airdev/next": "managed" */

'use client';

import { Button } from '@/airdev/frontend/components/ui/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/airdev/frontend/components/ui/Form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/airdev/frontend/components/ui/InputOTP';
import { useCreateOneNextauthVerificationToken } from '@/generated/tanstack-hooks/nextauth-verification-token-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { parseAsString, useQueryState } from 'nuqs';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Props = { email: string };

const formSchema = z.object({
  code: z.string().length(5, { message: 'Please enter a valid code' }),
});
type FormSchema = z.infer<typeof formSchema>;

export default function SignInVerify({ email }: Props) {
  const [next] = useQueryState('next', parseAsString);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const {
    mutate: createVerificationToken,
    isPending: isCreatingVerificationToken,
  } = useCreateOneNextauthVerificationToken();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: '' },
  });

  const onSubmit = useCallback(
    async (values: FormSchema) => {
      if (isSigningIn) {
        return;
      }
      setIsSigningIn(true);
      const { code } = values;

      await signIn('credentials', { email, code, callbackUrl: next || '/' })
        .catch(() => {
          form.setError('code', { message: 'Invalid code' });
        })
        .finally(() => setIsSigningIn(false));
    },
    [email, next, isSigningIn, form]
  );

  const handleComplete = useCallback(
    (value: string) => {
      form.setValue('code', value);
      form.handleSubmit(onSubmit)();
    },
    [form, onSubmit]
  );

  const resendCode = () => {
    if (isCreatingVerificationToken) {
      return;
    }
    createVerificationToken(
      { email },
      {
        onSuccess: () => {
          form.reset({ code: undefined });
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-y-5 sm:gap-y-6">
      <p className="text-muted-foreground text-center text-xl font-bold sm:text-2xl">
        Check your email for a verification code
      </p>
      <Form {...form}>
        <form
          className="flex flex-col gap-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="mb-4 flex flex-col items-center">
                <FormControl>
                  <InputOTP
                    maxLength={5}
                    {...field}
                    className="mx-auto w-full justify-center"
                    onComplete={handleComplete}
                  >
                    {Array.from(Array(5).keys()).map((i) => (
                      <InputOTPGroup key={i}>
                        <InputOTPSlot
                          index={i}
                          className="bg-background text-foreground size-11 text-base font-semibold sm:size-12"
                        />
                      </InputOTPGroup>
                    ))}
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="xl"
            disabled={isSigningIn}
            isLoading={isSigningIn}
            className="h-12 rounded-[12px]"
          >
            Sign In
          </Button>
          <Button
            type="button"
            variant="link"
            size="xl"
            disabled={
              isCreatingVerificationToken || form.formState.isSubmitting
            }
            onClick={resendCode}
          >
            Resend code
          </Button>
        </form>
      </Form>
    </div>
  );
}

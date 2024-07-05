'use client';

import { Trans, useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LIST_ROUTER } from '@/app/lib/constants/common';
import { InputLabel } from '../../InputLabel';
import { Button } from '../../ui/button';
import { toast } from 'react-toastify';
import { useFormState, useFormStatus } from 'react-dom';
import { getMessageFromCode } from '@/app/lib/utils';
import { authenticate } from '@/app/[locale]/(auth)/login/actions';
import { LoadingIcon } from '../../LoadingIcon';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { IconFacebook, IconGitHub, IconGoogle } from '../../ui/icons';
import { socialLogin } from '@/app/lib/actions';

export type LoginFormData = {
  email: string;
  password: string;
};

function LoginForm() {
  const router = useRouter();
  const [result, dispatch] = useFormState(authenticate, undefined);
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [error, setError] = useState('');

  useEffect(() => {
    if (result) {
      if (result.message) {
        return setError(result.message);
      }
      setError('');
      if (result.type === 'error') {
        toast.error(getMessageFromCode(result.resultCode));
      } else {
        toast.success(getMessageFromCode(result.resultCode), {
          className: 'bg-green-500',
          autoClose: 1000
        });
        router.push(callbackUrl ? callbackUrl : LIST_ROUTER.DASHBOARD);
        router.refresh();
      }
    }
  }, [callbackUrl, result, router]);

  return (
    <>
      <form action={dispatch}>
        <div className="flex flex-col flex-wrap gap-5 p-4">
          {error && (
            <div className="mb-4 flex flex-wrap items-center justify-center gap-4 self-center bg-[#f92d6a0d] px-4 py-2 text-red-500">
              <XCircleIcon className="h-8 w-8 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid gap-1">
            <InputLabel
              label={t('email_field').toUpperCase()}
              name="email"
              defaultValue="admin@gmail.com"
            />
            <p className="text-red-500">{result?.errors?.email}</p>
          </div>

          <div className="grid gap-1">
            <InputLabel
              label={t('password_field').toUpperCase()}
              type="password"
              name="password"
              defaultValue="Admin123"
            />
            <p className="text-red-500">{result?.errors?.password}</p>
          </div>

          <Link
            className="self-end font-semibold text-blue-700"
            href={LIST_ROUTER.FORGOT_PASSWORD}
          >
            Forgot password?
          </Link>

          <div className="mt-5 flex justify-center">
            <LoginButton />
          </div>
        </div>
      </form>

      <div className="my-10 mt-6 flex justify-center gap-4">
        <IconGitHub
          className="size-8 cursor-pointer"
          onClick={() => socialLogin('github')}
        />
        <IconGoogle
          className="size-8 cursor-pointer"
          onClick={() => socialLogin('google')}
        />
        <IconFacebook
          className="size-8 cursor-pointer"
          onClick={() => socialLogin('facebook')}
        />
      </div>

      <p className="mt-4 text-center font-semibold">
        <Trans i18nKey="login:sign_up_link">
          Don&apos;t have an account?{' '}
          <Link href={LIST_ROUTER.REGISTER} className="text-blue-700">
            Sign up here
          </Link>
        </Trans>
      </p>
    </>
  );
}

export default LoginForm;

function LoginButton() {
  const { pending } = useFormStatus();
  const { t } = useTranslation();

  return (
    <Button
      className="w-full"
      variant={'default'}
      type="submit"
      size={'lg'}
      disabled={pending}
    >
      {pending && <LoadingIcon />}
      {t('login:login_title')}
    </Button>
  );
}

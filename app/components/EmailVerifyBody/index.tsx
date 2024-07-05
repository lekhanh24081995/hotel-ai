'use client';

import { CheckIcon, XCircleIcon } from '@heroicons/react/16/solid';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { LIST_ROUTER } from '@/app/lib/constants/common';
import Image from 'next/image';
import { requestVerifyEmail } from '@/app/lib/services/auth';

function EmailVerifyBody() {
  const { t, i18n } = useTranslation();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const initRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    const verifyEmailToken = async (token: string) => {
      try {
        const res = await requestVerifyEmail(token);

        toast.success(t('verify_success'), {
          className: 'bg-green-500',
          autoClose: 1000
        });
        setIsSuccess(true);

        router.push(LIST_ROUTER.LOGIN);
      } catch (e: any) {
        const error: CustomError = e.body?.error;

        if (error) {
          const { message, error_id } = error;

          const errorMessage = `${message} (${error_id})`;

          setError(errorMessage);
        } else {
          toast.error(t('common:error_messages.unknown_error'));
        }
      }
    };

    if (!initRef.current) {
      initRef.current = true;

      if (token) {
        verifyEmailToken(token);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex max-w-2xl flex-col items-center justify-center rounded bg-white p-4 md:p-10 dark:bg-black dark:text-white dark:ring-2 dark:ring-white">
      <div className="relative h-28 w-28 md:h-52 md:w-52">
        <Image
          src={'/email-verification.png'}
          alt="Verify Email"
          sizes="(max-width: 768px) 100vw, 100vw"
          fill
          priority
          className="object-cover"
        />
      </div>

      {error && (
        <div className="flex flex-wrap items-center justify-center gap-4 self-center bg-[#f92d6a0d] px-4 py-2 text-red-500">
          <XCircleIcon className="h-12 w-12 flex-shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {!error && (
        <h1 className="py-4 text-center text-lg font-bold md:py-10 md:text-3xl">
          {isSuccess ? t('verify_success') : t('title', { email: email })}
        </h1>
      )}

      <ul className={`mt-10 w-full list-inside`}>
        <li className="flex items-center gap-3">
          <CheckIcon className="h-5 w-5 text-primary dark:rounded-full dark:bg-white" />
          {t('instructions.0')}
        </li>
        <li className="flex items-center gap-3">
          <CheckIcon className="h-5 w-5 text-primary dark:rounded-full dark:bg-white" />
          {t('instructions.1')}
        </li>
        <li className="flex items-center gap-3">
          <CheckIcon className="h-5 w-5 text-primary dark:rounded-full dark:bg-white" />
          {t('instructions.2')}
        </li>
      </ul>
    </div>
  );
}

export default EmailVerifyBody;

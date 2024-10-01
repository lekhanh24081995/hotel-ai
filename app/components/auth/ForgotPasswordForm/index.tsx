'use client';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import { forgotPasswordSchema } from '@/app/lib/yup-schema';
import { useConfirmRedirectIfDirty } from '@/app/lib/hooks/useConfirmRedirectIfDirty';
import { InputLabel } from '../../InputLabel';
import { Button } from '../../ui/button';
import Link from 'next/link';
import { LIST_ROUTER } from '@/app/lib/constants/common';
import { requestResetPassword } from '@/app/lib/services/users';
import { toast } from 'react-toastify';
import { LoadingIcon } from '../../LoadingIcon';

export type LoginFormData = {
  email: string;
};

function ForgotPasswordForm() {
  const { t, i18n } = useTranslation();
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const {
    handleSubmit,
    setError: setHookFormError,
    control,
    formState: { isSubmitting, errors, isDirty }
  } = useForm<LoginFormData>({
    resolver: yupResolver(forgotPasswordSchema(t)),
    defaultValues: {
      email: ''
    }
  });

  useConfirmRedirectIfDirty(isDirty);

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    await requestResetPassword(data);

    toast.success(
      'An email has been sent to reset your password. Please check your inbox!',
      {
        className: 'bg-green-500',
        autoClose: 5000
      }
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col flex-wrap gap-5 p-4">
          {error && (
            <div className="flex flex-wrap items-center justify-center gap-4 self-center bg-[#f92d6a0d] px-4 py-2 text-red-500">
              <XCircleIcon className="h-12 w-12 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <InputLabel
                label={t('email_field').toUpperCase()}
                error={errors?.email}
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Button size={'lg'} className="mt-4 w-full" disabled={isSubmitting}>
            {isSubmitting && <LoadingIcon />}
            Submit
          </Button>
          <Link
            href={LIST_ROUTER.LOGIN}
            className="text-center font-semibold text-blue-700"
          >
            Return to login
          </Link>
        </div>
      </form>
    </>
  );
}

export default ForgotPasswordForm;

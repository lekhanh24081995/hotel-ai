'use server';

import { signIn } from '@/auth';
import { AuthError, CredentialsSignin } from 'next-auth';
import { ResultCode } from '@/app/lib/utils';
import initTranslations from '@/app/i18n';
import { loginSchema } from '@/app/lib/yup-schema';
import * as yup from 'yup';

interface Result {
  type: string;
  resultCode: ResultCode;
  message?: string;
  errors?: Record<string, any>;
}

export async function authenticate(
  _prevState: Result | undefined,
  formData: FormData
): Promise<Result | undefined> {
  try {
    const email = formData.get('email');
    const password = formData.get('password');

    const { t } = await initTranslations('en', ['common']);

    try {
      await loginSchema(t).validate(
        {
          email,
          password
        },
        {
          abortEarly: false
        }
      );
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors = error.inner.reduce<Record<string, any>>((acc, err) => {
          if (err.path !== undefined) {
            acc[err.path] = err.message;
          }
          return acc;
        }, {});

        return {
          type: 'error',
          resultCode: ResultCode.InvalidCredentials,
          errors
        };
      }
    }
    await signIn('credentials', {
      email,
      password,
      redirect: false
    });

    return {
      type: 'success',
      resultCode: ResultCode.UserLoggedIn
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch ((error.cause?.err as CredentialsSignin)?.code) {
        case 'credentials':
          return {
            type: 'error',
            resultCode: ResultCode.InvalidCredentials,
            message: error.cause?.err?.message
          };
        case 'unverified':
          return {
            type: 'error',
            resultCode: ResultCode.UnverifiedUser,
            message: error.cause?.err?.message
          };
        default:
          return {
            type: 'error',
            resultCode: ResultCode.UnknownError,
            message: error.cause?.err?.message
          };
      }
    }
  }
}

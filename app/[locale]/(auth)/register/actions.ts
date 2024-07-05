'use server';

import { ResultCode } from '@/app/lib/utils';
import { AuthError, CredentialsSignin } from 'next-auth';
import { registerSchema } from '@/app/lib/yup-schema';
import initTranslations from '@/app/i18n';
import * as yup from 'yup';
import { requestRegister } from '@/app/lib/services/auth';
interface Result {
  type: string;
  resultCode: ResultCode;
  message?: string;
  errors?: Record<string, any>;
}

export async function signup(
  _prevState: Result | undefined,
  formData: FormData
): Promise<Result | undefined> {
  const rawFormData = Object.fromEntries(formData);

  const { t } = await initTranslations('en', ['common']);

  try {
    await registerSchema(t).validate(rawFormData, {
      abortEarly: false
    });
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

  try {
    const res: {
      error: CustomError;
    } = await requestRegister(rawFormData);

    if (res.error) {
      switch (res.error.error_id) {
        case 'RE-0001':
          const errors = res.error.errors.reduce<Record<string, any>>(
            (acc, err) => {
              acc[err.field] = err.message;
              return acc;
            },
            {}
          );

          return {
            type: 'error',
            resultCode: ResultCode.UserAlreadyExists,
            message: res.error.message,
            errors
          };
        default:
          throw res.error;
      }
    }

    return {
      type: 'success',
      resultCode: ResultCode.UserCreated
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
        default:
          return {
            type: 'error',
            resultCode: ResultCode.UnknownError,
            message: error.cause?.err?.message
          };
      }
    } else {
      return {
        type: 'error',
        resultCode: ResultCode.UnknownError
      };
    }
  }
}

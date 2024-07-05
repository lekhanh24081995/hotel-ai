import { TFunction } from 'i18next';
import * as yup from 'yup';

export const loginSchema = (t: TFunction<[string, string], undefined>) => {
  return yup
    .object({
      email: yup
        .string()
        .email(t('error_messages.invalid_email_format'))
        .required(
          t('error_messages.field_required', {
            field: t('email_field')
          })
        )
        .max(
          255,
          t('error_messages.max_length', {
            field: `${t('email_field')}`,
            number: 255
          })
        ),
      password: yup
        .string()
        .required(
          t('error_messages.field_required', {
            field: t('password_field')
          })
        )
        .min(8, t('error_messages.invalid_password_format'))
        .max(
          255,
          t('error_messages.max_length', {
            field: `${t('password_field')}`,
            number: 255
          })
        )
        .test(
          'is-password-valid',
          t('error_messages.invalid_password_format'),
          (value) => {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

            return passwordRegex.test(value);
          }
        )
    })
    .required();
};

export const registerSchema = (t: TFunction<[string, string], undefined>) => {
  return yup
    .object({
      full_name: yup
        .string()
        .required(
          t('error_messages.field_required', {
            field: t('name_field')
          })
        )
        .min(
          5,
          t('error_messages.min_length', {
            field: `${t('name_field')}`,
            number: 5
          })
        )
        .max(
          255,
          t('error_messages.max_length', {
            field: `${t('name_field')}`,
            number: 255
          })
        ),
      email: yup
        .string()
        .required(
          t('error_messages.field_required', {
            field: t('email_field')
          })
        )
        .email(t('error_messages.invalid_email_format'))
        .max(
          255,
          t('error_messages.max_length', {
            number: 255
          })
        ),
      password: yup
        .string()
        .required(
          t('error_messages.field_required', {
            field: t('password_field')
          })
        )
        .min(8, t('error_messages.invalid_password_format'))
        .max(
          255,
          t('error_messages.max_length', {
            field: t('password_field'),
            number: 255
          })
        )
        .test(
          'is-password-valid',
          t('error_messages.invalid_password_format'),
          (value) => {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

            return passwordRegex.test(value);
          }
        ),
      confirm_password: yup
        .string()
        .required(
          t('error_messages.field_required', {
            field: t('confirm_password_field')
          })
        )
        .max(255)
        .oneOf(
          [yup.ref('password')],
          t('error_messages.passwords_do_not_match')
        )
    })
    .required();
};

export const forgotPasswordSchema = (
  t: TFunction<[string, string], undefined>
) => {
  return yup
    .object({
      email: yup
        .string()
        .email(t('error_messages.invalid_email_format'))
        .required(
          t('error_messages.field_required', {
            field: t('email_field')
          })
        )
        .max(
          255,
          t('error_messages.max_length', {
            field: `${t('email_field')}`,
            number: 255
          })
        )
    })
    .required();
};

export const resetPasswordSchema = (
  t: TFunction<[string, string], undefined>
) => {
  return yup
    .object({
      password: yup
        .string()
        .required(
          t('error_messages.field_required', {
            field: t('password_field')
          })
        )
        .min(8, t('error_messages.invalid_password_format'))
        .max(
          255,
          t('error_messages.max_length', {
            field: t('password_field'),
            number: 255
          })
        )
        .test(
          'is-password-valid',
          t('error_messages.invalid_password_format'),
          (value) => {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

            return passwordRegex.test(value);
          }
        ),
      confirm_password: yup
        .string()
        .required(
          t('error_messages.field_required', {
            field: t('confirm_password_field')
          })
        )
        .max(255)
        .oneOf(
          [yup.ref('password')],
          t('error_messages.passwords_do_not_match')
        )
    })
    .required();
};

export const searchSchema = (t: TFunction<[string, string], undefined>) => {
  return yup
    .object({
      query: yup.string().required(
        t('error_messages.field_required', {
          field: t('password_field')
        })
      )
    })
    .required();
};

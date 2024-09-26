import { mongooseConnect } from '@/app/lib/mongoose';
import bcrypt from 'bcrypt';
import User from '@/app/lib/models/User';
import { ApiError, handleError } from '@/app/lib/exceptions';
import { headers } from 'next/headers';
import initTranslations from '@/app/i18n';
import * as yup from 'yup';
import { TFunction } from 'i18next';
import { MAILTRAP } from '@/app/lib/constants/common';
import nodemailer from 'nodemailer';
import { generateRegisterToken } from '@/app/lib/tokens';
import RegisterToken from '@/app/lib/models/RegisterToken';
import { registerMail } from '@/app/components/RegisterMail';
import ResetPasswordToken from '@/app/lib/models/ResetPasswordToken';

export async function GET(req: Request) {
  await mongooseConnect();

  const { searchParams } = new URL(req.url);
  const limit = searchParams.get('limit') || 9;
  const offset = searchParams.get('offset') || 0;

  const queryObject = Object.fromEntries(searchParams.entries());
  const conditions = Object.entries(queryObject).map(([key, value]) => ({
    [key]: value
  }));

  try {
    if (conditions.length > 0 && !queryObject.limit && !queryObject.offset) {
      const user = await User.findOne({
        $or: conditions
      }).select('-password');

      return Response.json({
        status_code: 200,
        message: 'Success',
        data: user
      });
    }
    const totalUsers = await User.find({});
    const users = await User.find({})
      .select('-password')
      .limit(Number(limit))
      .skip(Number(offset));

    return Response.json({
      status_code: 200,
      message: 'Success',
      data: {
        items: users,
        pagination: {
          total: totalUsers.length,
          limit,
          offset
        },
        link: {
          self: '',
          next: '',
          last: ''
        }
      }
    });
  } catch (e) {
    const error = ApiError.fromUnexpected();
    return handleError(error, 500);
  }
}

export async function POST(req: Request) {
  await mongooseConnect();

  const res = await req.json();

  const url = new URL(req.url);

  const { full_name, email, password, is_verified, grant_type, image } = res;

  const lang = headers().get('Accept-Language') || 'en';
  const { t } = await initTranslations(lang, ['common']);

  if (grant_type !== 'social_login') {
    try {
      await registerSchema(t).validate(
        {
          email,
          password,
          full_name
        },
        {
          abortEarly: false
        }
      );
    } catch (error: any) {
      if (error instanceof yup.ValidationError) {
        const apiError = ApiError.fromYupError(error, 'RE-0001');
        return handleError(apiError, 400);
      } else {
        const apiError = ApiError.fromUnexpected();
        return handleError(apiError, 500);
      }
    }
  }

  const userExists = await User.findOne({
    $or: [{ email }]
  });

  if (userExists) {
    const error = ApiError.fromEmailExists();
    return handleError(error, 400);
  }

  let hashPassword;
  const salt = await bcrypt.genSalt(10);

  if (grant_type !== 'social_login') {
    hashPassword = await bcrypt.hash(password, salt);
  } else {
    const randomString = crypto.randomUUID();
    hashPassword = await bcrypt.hash(randomString, salt);
  }

  const user = await User.create({
    full_name,
    email,
    password: hashPassword,
    is_verified,
    image
  });

  if (!user.is_verified) {
    const register_token = generateRegisterToken(user.id);

    await RegisterToken.create({
      user: user.id,
      register_token
    });

    let transporter;
    if (process.env.NODE_ENV === 'production') {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } else {
      transporter = nodemailer.createTransport({
        host: MAILTRAP.HOST,
        port: Number(MAILTRAP.PORT),
        auth: {
          user: MAILTRAP.USER,
          pass: MAILTRAP.PASSWORD
        }
      });
    }

    try {
      const res = await transporter.sendMail({
        from: '"Hotel AI Team" <hotelai@administration.com>',
        to: user.email,
        subject: 'Account Registration Verification',
        text: 'Thank you for registering with us! Please use the following link to verify your account:',
        html: registerMail(url.origin, register_token, user.email)
      });
    } catch (error) {
      const apiError = ApiError.fromSendEmailError();
      return handleError(apiError, 500);
    }
  }
  return Response.json(
    {
      status_code: 201,
      message: 'Success'
    },
    { status: 201 }
  );
}

export async function PUT(req: Request) {
  await mongooseConnect();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('_id');

  const res = await req.json();

  const { full_name, image, password, reset_password_token } = res;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    res.password = hashPassword;
  }

  await User.findByIdAndUpdate(
    id,
    {
      full_name,
      image,
      password: res.password
    },
    {
      new: true
    }
  );

  if (reset_password_token) {
    await ResetPasswordToken.findOneAndDelete({
      reset_password_token
    });
  }

  return Response.json({
    status_code: 200,
    message: 'Success'
  });
}

export async function DELETE(req: Request) {
  await mongooseConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('_id');

  await User.findByIdAndDelete(id);

  return Response.json({
    status_code: 200,
    message: 'Success'
  });
}

const registerSchema = (t: TFunction<[string, string], undefined>) => {
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
        )
    })
    .required();
};

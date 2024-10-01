import { ApiError, handleError } from '@/app/lib/exceptions';
import User from '@/app/lib/models/User';
import { mongooseConnect } from '@/app/lib/mongoose';
import { MAILTRAP } from '@/app/lib/constants/common';
import nodemailer from 'nodemailer';
import { ResetPasswordMail } from '@/app/components/ResetPasswordMail';
import { generateResetPasswordToken } from '@/app/lib/tokens';
import ResetPasswordToken from '@/app/lib/models/ResetPasswordToken';
export async function POST(req: Request) {
  await mongooseConnect();

  const res = await req.json();
  const url = new URL(req.url);

  const { email } = res;

  const user = await User.findOne({
    $or: [{ email }]
  });

  if (!user) {
    const error = ApiError.fromInvalidEmailPassword();
    return handleError(error, 400);
  }

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

  const reset_password_token = generateResetPasswordToken(user.id);

  await ResetPasswordToken.create({
    user: user.id,
    reset_password_token
  });

  await transporter.sendMail({
    from: '"Hotel AI Team" <hotelai@administration.com>',
    to: email,
    subject: 'Reset Your Password',
    text: `We have sent this email because you have requested to reset your password. If this wasn't you, please ignore this email.`,
    html: ResetPasswordMail(url.origin, reset_password_token, user.email)
  });

  return Response.json(
    {
      status_code: 201,
      message: 'Success'
    },
    { status: 201 }
  );
}

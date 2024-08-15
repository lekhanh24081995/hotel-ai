import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { login } from './app/lib/actions';
import Google from '@auth/core/providers/google';
import Facebook from '@auth/core/providers/facebook';
import Github from '@auth/core/providers/github';
import { JWT } from 'next-auth/jwt';
import { requestGetMe } from './app/lib/services/users';

declare module 'next-auth' {
  interface User {
    id?: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
    email?: string | null;
    full_name: string;
    image?: string | null;
    username: string;
    role: string;
    chatIds: string[];
    createdAt: string;
    _id: string;
    updatedAt: string;
  }

  interface Session {
    user: {
      id: string;
      access_token: string;
      refresh_token: string;
      expires_in: number;
      email?: string | null;
      full_name: string;
      image?: string | null;
      username: string;
      role: string;
      chatIds: string[];
      createdAt: string;
      _id: string;
      updatedAt: string;
    };
    access_token: string;
    refresh_token: string;
    error: string;
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    user: {
      id?: string;
      access_token: string;
      refresh_token: string;
      expires_in: number;
      email?: string | null;
      full_name: string;
      image?: string | null;
      username: string;
      role: string;
      chatIds: string[];
      createdAt: string;
      _id: string;
      updatedAt: string;
    };
    access_token: string;
    refresh_token: string;
    access_token_expires: number;
    error: string;
  }
}

class UnverifiedUser extends CredentialsSignin {
  code = 'unverified';
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string
    }),
    Github({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string
    }),
    Facebook({
      clientId: process.env.FACEBOOK_ID as string,
      clientSecret: process.env.FACEBOOK_SECRET as string
    }),
    Credentials({
      async authorize(credentials) {
        const res: {
          data: {
            access_token: string;
            refresh_token: string;
            expires_in: number;
          };
          error: CustomError;
        } = await login(credentials);

        if (res.error) {
          switch (res.error.error_id) {
            case 'LO-0001':
              throw new CredentialsSignin(res.error.message);
            case 'LO-0003':
              throw new UnverifiedUser(res.error.message);
            default:
              throw res.error;
          }
        }

        const data = res.data;
        const { access_token, refresh_token, expires_in } = data;

        const { data: user } = await requestGetMe({
          Authorization: 'Bearer ' + access_token
        });

        if (!user) {
          return null;
        }

        return {
          ...user,
          access_token,
          refresh_token,
          expires_in
        };
      }
    })
  ]
});

import type { NextAuthConfig } from 'next-auth';
import { LIST_ROUTER } from './app/lib/constants/common';
import { requestSocialLogin } from './app/lib/services/auth';
import { requestGetMe } from './app/lib/services/users';

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: LIST_ROUTER.LOGIN,
    newUser: LIST_ROUTER.REGISTER
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (account) {
        token = {
          ...token,
          access_token: account.access_token || ''
        };
      }
      if (user) {
        token = {
          ...token,
          id: user._id,
          access_token: user.access_token,
          refresh_token: user.refresh_token,
          user
        };
      }

      if (trigger === 'update' && session) {
        // token = { ...token, user: session };
        // return token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        const {
          id,
          user: { full_name, id: userId, role },
          access_token,
          refresh_token
        } = token;
        const { user } = session;
        session = {
          ...session,
          access_token,
          refresh_token,
          user: {
            ...user,
            id: (id !== undefined ? id : userId) as string,
            name: full_name ? full_name : user.name,
            full_name: user.name ? user.name : full_name,
            role: role
          }
        };
      }
      return session;
    },
    async signIn({ profile, user, account }) {
      if (profile && account) {
        const res = await requestSocialLogin({
          email: profile?.email,
          full_name: profile?.name,
          image:
            account?.provider === 'github'
              ? profile?.avatar_url
              : profile?.picture,
          is_verified:
            account?.provider === 'google' ? profile?.email_verified : true,
          provider: account?.provider,
          providerAccountId: account?.providerAccountId
        });

        if (res.error) {
          return false;
        }

        const data = res.data;
        const { access_token, refresh_token } = data;

        const { data: returnUser } = await requestGetMe({
          Authorization: 'Bearer ' + access_token
        });

        user.id = returnUser._id;
        user.access_token = access_token;
        user.refresh_token = refresh_token;
        user.role = returnUser.role;

        return true;
      }
      return true;
    }
  },
  providers: []
} satisfies NextAuthConfig;

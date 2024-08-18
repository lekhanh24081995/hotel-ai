import type { NextAuthConfig } from 'next-auth';
import { LIST_ROUTER } from './app/lib/constants/common';
import { getProfile, socialLogin } from './app/lib/actions';

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: LIST_ROUTER.LOGIN,
    newUser: LIST_ROUTER.REGISTER
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token = {
          ...token
        };
      }
      if (user) {
        token = {
          ...token,
          id: user._id,
          user
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        const {
          id,
          user: { full_name, id: userId, role }
        } = token;
        const { user } = session;
        session = {
          ...session,
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
        const res = await socialLogin({
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

        const { data: returnUser } = await getProfile();

        user.id = returnUser._id;
        user.role = returnUser.role;

        return true;
      }
      return true;
    }
  },
  providers: []
} satisfies NextAuthConfig;

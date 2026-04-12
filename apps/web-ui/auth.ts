import NextAuth, { DefaultSession } from 'next-auth';
import Google from 'next-auth/providers/google';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string;
    } & DefaultSession['user'];
  }

  interface User {
    id?: string;
  }

  interface JWT {
    id?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // Add logic here if you want to redirect unauthenticated users later
      return true;
    },
    jwt({ token, user, account }) {
      if (account) {
        token.id = account.providerAccountId;
      } else if (user && !token.id) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      const userId = (token.id || token.sub) as string;
      if (userId && session.user) {
        session.user.id = userId;
      }
      return session;
    },
  },
});

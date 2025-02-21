import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";

declare module "@auth/core/adapters" {
  interface AdapterUser {
    isAdmin: boolean;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      isAdmin: boolean;
    } & DefaultSession["user"]
  }
}

// List of allowed admin emails
const ADMIN_EMAILS = [
  'tommy@release.com',
  'erik@release.com',
  'david@release.com',
  'myril@release.com'
];

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return ADMIN_EMAILS.includes(user?.email ?? '');
    },
    async jwt({ token, user }) {
      if (user?.email) {
        token.isAdmin = ADMIN_EMAILS.includes(user.email);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = Boolean(token.isAdmin);
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
});

export { handler as GET, handler as POST }; 
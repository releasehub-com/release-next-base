import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Ensure NEXTAUTH_SECRET exists
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET environment variable is required');
}

declare module "next-auth" {
  interface Session {
    user: {
      isAdmin: boolean;
    } & DefaultSession["user"]
  }

  interface User {
    isAdmin: boolean;
  }

  interface JWT {
    isAdmin?: boolean;
    email?: string;
    name?: string;
    picture?: string;
  }
}

// List of allowed admin emails
const ADMIN_EMAILS = [
  'tommy@release.com',
  'erik@release.com',
  'david@release.com',
  'myril@release.com',
  'tommy@releaseapp.io'
];

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account"
        }
      },
      profile(profile) {
        const isAdmin = ADMIN_EMAILS.includes(profile.email);
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          isAdmin
        };
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only allow sign in for admin emails
      return ADMIN_EMAILS.includes(user.email ?? '');
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        // First time jwt callback is run, user object is available
        token.isAdmin = Boolean(user.isAdmin);
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = Boolean(token.isAdmin);
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
    signOut: '/admin/login'
  }
});

export { handler as GET, handler as POST }; 
import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import type { Adapter } from "next-auth/adapters";

// Ensure NEXTAUTH_SECRET exists
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET environment variable is required");
}

declare module "next-auth" {
  interface Session {
    user: {
      isAdmin: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    isAdmin: boolean;
  }

  interface JWT {
    isAdmin?: boolean;
    email?: string;
    name?: string;
    picture?: string;
    sub?: string;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    isAdmin: boolean;
  }
}

// List of allowed admin emails
const ADMIN_EMAILS = [
  "tommy@release.com",
  "erik@release.com",
  "david@release.com",
  "myril@release.com",
  "tommy@releaseapp.io",
];

const handler = NextAuth({
  adapter: DrizzleAdapter(db) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
          response_type: "code",
          scope: "openid email profile",
        },
      },
      profile(profile) {
        const isAdmin = ADMIN_EMAILS.includes(profile.email);
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          isAdmin,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only allow sign in for admin emails
      const isAllowed = ADMIN_EMAILS.includes(user.email ?? "");
      if (!isAllowed) {
        throw new Error("Unauthorized email");
      }
      return true;
    },
    async jwt({ token, user, account, profile, trigger }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          isAdmin: Boolean(user.isAdmin),
          email: user.email,
          name: user.name,
          picture: user.image,
          sub: user.id,
        };
      }
      // On subsequent calls, if we have an admin token, keep it
      if (token?.isAdmin) {
        return token;
      }
      // Otherwise, check if the email is still allowed
      if (token?.email && ADMIN_EMAILS.includes(token.email)) {
        token.isAdmin = true;
        return token;
      }
      // If we get here, the token is not valid for admin access
      return null;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.isAdmin = Boolean(token.isAdmin);
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
        // @ts-ignore - Add the ID to the session
        session.user.id = token.sub;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle callback after sign in
      if (url.includes("/api/auth/callback")) {
        return `${baseUrl}/admin`;
      }
      // Handle sign in page
      if (url.includes("/admin/login")) {
        return `${baseUrl}/admin`;
      }
      // Allow relative callback URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Allow callback URLs on the same origin
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      return `${baseUrl}/admin`;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
    signOut: "/admin/login",
  },
});

export { handler as GET, handler as POST };

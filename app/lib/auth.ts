import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
    jwt({ token }) {
      // You can customize this based on your admin user logic
      token.isAdmin = true; // For development, consider all authenticated users as admins
      return token;
    },
  },
  // Add your auth providers here
  providers: [],
};

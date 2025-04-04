import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import type { Adapter } from "next-auth/adapters";
import { eq } from "drizzle-orm";
import { user } from "@/lib/db/schema";

// Ensure NEXTAUTH_SECRET exists
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET environment variable is required");
}

// Create a separate client for the auth adapter with the same SSL config
const authClient = postgres(process.env.POSTGRES_URL!, {
  max: 1,
  // SSL is disabled as our database doesn't support it
});

const authDb = drizzle(authClient);

declare module "next-auth" {
  interface Session {
    user: {
      isAdmin: boolean;
      timezone?: string;
      id?: string;
    } & DefaultSession["user"];
  }

  interface User {
    isAdmin: boolean;
    timezone?: string;
  }

  interface JWT {
    isAdmin?: boolean;
    email?: string;
    name?: string;
    picture?: string;
    sub?: string;
    timezone?: string;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    isAdmin: boolean;
    timezone?: string;
  }
}

// List of allowed admin emails
const ADMIN_EMAILS = [
  "tommy@release.com",
  "erik@release.com",
  "david@release.com",
  "myril@release.com",
  "tommy@releaseapp.io",
  "jay@release.com",
];

const handler = NextAuth({
  adapter: DrizzleAdapter(authDb) as Adapter,
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
          prompt: "consent select_account",
          response_type: "code",
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar.readonly",
        },
      },
      async profile(profile, tokens) {
        console.log("\n=== 🔍 GOOGLE AUTH PROFILE START ===");
        console.log("Profile:", {
          email: profile.email,
          name: profile.name,
          sub: profile.sub,
        });
        console.log("Tokens:", {
          hasAccessToken: !!tokens.access_token,
          accessTokenLength: tokens.access_token?.length,
          scopes: tokens.scope?.split(" "),
          tokenType: tokens.token_type,
          expiresAt: tokens.expires_at,
        });

        const isAdmin = ADMIN_EMAILS.includes(profile.email);

        // Fetch user's timezone from Google Calendar API
        try {
          console.log("\n📅 Fetching timezone from Google Calendar API...");
          const calendarResponse = await fetch(
            "https://www.googleapis.com/calendar/v3/users/me/settings/timezone",
            {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
                Accept: "application/json",
              },
            },
          );

          console.log("Calendar API Response:", {
            status: calendarResponse.status,
            statusText: calendarResponse.statusText,
            url: calendarResponse.url,
          });

          let timezone = "America/Los_Angeles"; // Default timezone
          if (calendarResponse.ok) {
            const data = await calendarResponse.json();
            console.log("Calendar API Success:", data);
            timezone = data.value || timezone;
            console.log("Using timezone:", timezone);
          } else {
            const errorText = await calendarResponse.text();
            console.log("Calendar API Error:", {
              status: calendarResponse.status,
              error: errorText,
              hasCalendarScope: tokens.scope?.includes(
                "https://www.googleapis.com/auth/calendar.readonly",
              ),
            });
          }

          // Create user data object
          const userData = {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            isAdmin,
            timezone,
          };

          console.log("\nReturning user data:", userData);
          console.log("=== 🔍 GOOGLE AUTH PROFILE END ===\n");

          // Update the user's timezone in the database
          try {
            await authDb
              .update(user)
              .set({
                timezone,
                updatedAt: new Date(),
              })
              .where(eq(user.email, profile.email));
            console.log("Successfully updated timezone in database");
          } catch (dbError) {
            console.error("Error updating timezone in database:", dbError);
          }

          return userData;
        } catch (error) {
          console.error("Error in profile function:", error);
          const userData = {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            isAdmin,
            timezone: "America/Los_Angeles", // Default on error
          };
          console.log("\nReturning default user data due to error:", userData);
          console.log("=== 🔍 GOOGLE AUTH PROFILE END ===\n");
          return userData;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user: authUser, account, profile }) {
      console.log("\n=== 🔑 SIGN IN CALLBACK ===");
      console.log("User:", {
        email: authUser.email,
        timezone: authUser.timezone,
        hasTimezone: !!authUser.timezone,
      });
      console.log("Account type:", account?.type);
      console.log("Has profile:", !!profile);
      console.log("=== 🔑 SIGN IN CALLBACK END ===\n");

      // Get the latest user data from the database
      if (authUser.email) {
        try {
          const dbUser = await authDb
            .select()
            .from(user)
            .where(eq(user.email, authUser.email))
            .limit(1);

          if (dbUser.length > 0 && dbUser[0].timezone) {
            authUser.timezone = dbUser[0].timezone;
            console.log(
              "Updated user timezone from database:",
              dbUser[0].timezone,
            );
          }
        } catch (error) {
          console.error("Error fetching user from database:", error);
        }
      }

      const isAllowed = ADMIN_EMAILS.includes(authUser.email ?? "");
      if (!isAllowed) {
        throw new Error("Unauthorized email");
      }
      return true;
    },
    async jwt({ token, user: authUser, account, profile, trigger }) {
      console.log("\n=== 🔐 JWT CALLBACK ===");
      console.log("Trigger:", trigger);
      console.log("Token before:", {
        sub: token?.sub,
        timezone: token?.timezone,
        email: token?.email,
      });
      console.log("User data:", {
        timezone: authUser?.timezone,
        email: authUser?.email,
      });

      if (trigger === "signIn" && authUser?.email) {
        // On sign in, get fresh user data from the database
        try {
          const dbUser = await authDb
            .select()
            .from(user)
            .where(eq(user.email, authUser.email))
            .limit(1);

          if (dbUser.length > 0 && dbUser[0].timezone) {
            token.timezone = dbUser[0].timezone;
            console.log(
              "Updated token timezone from database:",
              dbUser[0].timezone,
            );
          }
        } catch (error) {
          console.error("Error fetching user from database:", error);
        }
      }

      if (account && authUser) {
        const newToken = {
          ...token,
          isAdmin: Boolean(authUser.isAdmin),
          email: authUser.email,
          name: authUser.name,
          picture: authUser.image,
          sub: authUser.id || token.sub,
          timezone: authUser.timezone || token.timezone, // Preserve existing timezone if not in user object
        };
        console.log("New token created:", {
          timezone: newToken.timezone,
          userId: newToken.sub,
        });
        console.log("=== 🔐 JWT CALLBACK END ===\n");
        return newToken;
      }

      console.log("=== 🔐 JWT CALLBACK END ===\n");
      if (token?.isAdmin) return token;
      if (token?.email && ADMIN_EMAILS.includes(token.email)) {
        token.isAdmin = true;
        return token;
      }
      return null;
    },
    async session({ session, token }) {
      console.log("\n=== 👤 SESSION CALLBACK ===");
      console.log("Token:", {
        hasToken: !!token,
        timezone: token?.timezone,
      });
      console.log("Session user before:", session.user);

      if (token && session.user) {
        session.user.isAdmin = Boolean(token.isAdmin);
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.timezone = token.timezone as string | undefined;
        session.user.id = token.sub;

        console.log("Updated session:", {
          timezone: session.user.timezone,
          userId: session.user.id,
        });
      }
      console.log("=== 👤 SESSION CALLBACK END ===\n");
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

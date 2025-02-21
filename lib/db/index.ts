import { drizzle } from 'drizzle-orm/postgres-js';
import { and, eq } from 'drizzle-orm';
import postgres from 'postgres';
import { users, socialAccounts } from './schema';
import type { NewSocialAccount, SocialAccount, User } from './schema';

// Create postgres client for queries
const queryClient = postgres(process.env.POSTGRES_URL!, {
  max: 1,
  ssl: process.env.NODE_ENV === 'production',
});

// Create drizzle database instance
export const db = drizzle(queryClient);

// Helper to get admin user by email
export async function getAdminUser(email: string): Promise<User | undefined> {
  try {
    const results = await db
      .select()
      .from(users)
      .where(and(
        eq(users.email, email),
        eq(users.isAdmin, true)
      ));
    return results[0];
  } catch (error) {
    console.error('Error getting admin user:', error);
    throw error;
  }
}

// Helper to get user's social accounts
export async function getUserSocialAccounts(userId: string): Promise<SocialAccount[]> {
  try {
    return await db
      .select()
      .from(socialAccounts)
      .where(eq(socialAccounts.userId, userId));
  } catch (error) {
    console.error('Error getting social accounts:', error);
    throw error;
  }
}

// Helper to create or update social account
export async function upsertSocialAccount(data: Omit<NewSocialAccount, 'createdAt' | 'updatedAt'>) {
  try {
    const { userId, provider, providerAccountId, ...rest } = data;
    const id = `${provider}_${providerAccountId}`;
    
    return await db
      .insert(socialAccounts)
      .values({
        id,
        userId,
        provider,
        providerAccountId,
        accessToken: rest.accessToken,
        refreshToken: rest.refreshToken,
        expiresAt: rest.expiresAt,
        tokenType: rest.tokenType,
        scope: rest.scope,
        metadata: rest.metadata,
      } satisfies NewSocialAccount)
      .onConflictDoUpdate({
        target: [socialAccounts.id],
        set: {
          accessToken: rest.accessToken,
          refreshToken: rest.refreshToken,
          expiresAt: rest.expiresAt,
          tokenType: rest.tokenType,
          scope: rest.scope,
          metadata: rest.metadata,
          updatedAt: new Date(),
        },
      });
  } catch (error) {
    console.error('Error upserting social account:', error);
    throw error;
  }
} 
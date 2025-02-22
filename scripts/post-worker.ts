#!/usr/bin/env node

import { Command } from 'commander';
import { db } from '@/lib/db';
import { scheduledPosts, socialAccounts } from '@/lib/db/schema';
import { eq, and, lte } from 'drizzle-orm';

const program = new Command();

program
  .name('post-worker')
  .description('Process scheduled social media posts')
  .option('-d, --dry-run', 'Run in dry-run mode (no actual posts)', false)
  .option('-l, --list', 'List scheduled posts', false)
  .option('--url <url>', 'Base URL of the application', process.env.NEXTAUTH_URL || 'http://localhost:3000')
  .option('--api-key <key>', 'API key for authentication', process.env.POST_WORKER_API_KEY);

program.parse();

const options = program.opts();

async function listScheduledPosts() {
  try {
    // Find all posts, including failed ones
    const posts = await db
      .select({
        post: scheduledPosts,
        account: socialAccounts
      })
      .from(scheduledPosts)
      .leftJoin(socialAccounts, eq(scheduledPosts.socialAccountId, socialAccounts.id));

    if (posts.length === 0) {
      console.log('No posts found.');
      return;
    }

    console.log(`Found ${posts.length} posts:\n`);
    posts.forEach(({ post, account }) => {
      console.log(`Post ID: ${post.id}`);
      console.log(`Platform: ${account?.provider}`);
      console.log(`Status: ${post.status}`);
      if (post.errorMessage) {
        console.log(`Error: ${post.errorMessage}`);
      }
      console.log(`Content: ${post.content}`);
      console.log(`Scheduled for: ${post.scheduledFor}`);
      console.log('---\n');
    });
  } catch (error) {
    console.error('Error listing posts:', error);
    process.exit(1);
  }
}

async function runPostWorker() {
  try {
    // If we're just listing posts, do that and return
    if (options.list) {
      await listScheduledPosts();
      return;
    }

    // Only check for API key if we're actually posting
    if (!options.apiKey && !options.dryRun) {
      throw new Error('POST_WORKER_API_KEY environment variable is required for posting');
    }

    if (options.dryRun) {
      console.log('Running in dry-run mode - no actual posts will be made');
    }

    console.log('Running post worker...');
    const response = await fetch(`${options.url}/api/admin/post-worker`, {
      method: 'POST',
      headers: {
        'x-api-key': options.apiKey || 'dry-run',
        'x-dry-run': options.dryRun ? '1' : '0',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API error: ${data.error}`);
    }

    console.log('Post worker results:', data.results);

    // Log summary
    const successCount = data.results.filter((r: any) => r.status === 'success').length;
    const errorCount = data.results.filter((r: any) => r.status === 'error').length;
    console.log(`Summary: ${successCount} posts ${options.dryRun ? 'would be' : 'were'} successful, ${errorCount} posts failed`);

  } catch (error) {
    console.error('Post worker error:', error);
    process.exit(1);
  }
}

runPostWorker(); 
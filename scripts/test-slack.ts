#!/usr/bin/env node

import { Command } from "commander";
import {
  sendSlackNotification,
  createScheduledPostNotification,
  createErrorNotification,
} from "../lib/slack";

const program = new Command();

program
  .name("test-slack")
  .description("Test Slack notifications for the post worker")
  .option(
    "-t, --type <type>",
    "Type of notification to send (success/error)",
    "success",
  )
  .option(
    "-p, --platform <platform>",
    "Platform to simulate (twitter/linkedin/hackernews)",
    "twitter",
  )
  .option("-v, --verbose", "Enable verbose logging", false);

program.parse();

const options = program.opts();

// Helper function for verbose logging
function verboseLog(...args: any[]) {
  if (options.verbose) {
    console.log(...args);
  }
}

async function testSlackNotification() {
  try {
    // Get the platform from command line arguments
    const platform = options.platform || "twitter";

    console.log(`🔔 Testing Slack notification for ${platform}...`);

    if (!process.env.SLACK_WEBHOOK_URL) {
      console.error("❌ SLACK_WEBHOOK_URL environment variable is not set");
      console.log(
        "Please set the SLACK_WEBHOOK_URL environment variable and try again",
      );
      process.exit(1);
    }

    verboseLog("Using webhook URL:", process.env.SLACK_WEBHOOK_URL);

    const now = new Date();
    const scheduledFor = new Date(now.getTime() + 60 * 1000); // 1 minute from now

    if (options.type === "success") {
      verboseLog(`Sending success notification for ${platform}...`);

      // For HackerNews reminder
      if (platform === "hackernews") {
        await sendSlackNotification(
          createScheduledPostNotification({
            platform: "hackernews",
            content: "Test Hacker News Submission Title",
            scheduledFor,
            metadata: {
              type: "reminder",
              url: "https://example.com/test-article",
              userEmail: "test@example.com",
              userName: "Test User",
              timezone: "America/Los_Angeles",
            },
          }),
        );
      } else {
        // For Twitter/LinkedIn post
        await sendSlackNotification(
          createScheduledPostNotification({
            platform: platform,
            content:
              "This is a test post content for Slack notification testing.",
            scheduledFor,
            metadata: {
              userEmail: "test@example.com",
              userName: "Test User",
              timezone: "America/Los_Angeles",
              postUrl: `https://example.com/${platform}/test-post`,
            },
          }),
        );
      }

      console.log(`✅ Success notification sent for ${platform}!`);
    } else {
      verboseLog(`Sending error notification for ${platform}...`);

      await sendSlackNotification(
        createErrorNotification({
          platform: platform,
          content: "This is a test post content that failed.",
          errorMessage:
            "This is a test error message for Slack notification testing.",
          scheduledFor,
          metadata: {
            userEmail: "test@example.com",
            userName: "Test User",
            timezone: "America/Los_Angeles",
          },
        }),
      );

      console.log(`✅ Error notification sent for ${platform}!`);
    }
  } catch (error) {
    console.error("❌ Error sending Slack notification:", error);
    process.exit(1);
  }
}

testSlackNotification();

#!/usr/bin/env node

import { Command } from "commander";

const program = new Command();

program
  .name("test-post")
  .description("Send a test post to social media")
  .requiredOption(
    "-p, --platform <platform>",
    "Platform to post to (twitter or linkedin)",
  )
  .requiredOption("-c, --content <content>", "Content to post")
  .option(
    "-t, --token <token>",
    "Authentication token (if not using session auth)",
  )
  .option(
    "-u, --url <url>",
    "Base URL of the application",
    process.env.NEXTAUTH_URL || "http://localhost:3000",
  );

program.parse();

const options = program.opts();

async function sendTestPost() {
  try {
    const response = await fetch(`${options.url}/api/admin/test-post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options.token && { Authorization: `Bearer ${options.token}` }),
      },
      body: JSON.stringify({
        platform: options.platform,
        content: options.content,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to send test post");
    }

    console.log("Test post sent successfully!");
  } catch (error) {
    console.error("Error sending test post:", error);
    process.exit(1);
  }
}

sendTestPost();

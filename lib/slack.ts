interface SlackMessage {
  text?: string;
  blocks?: Array<{
    type: string;
    text?: {
      type: string;
      text: string;
    };
    fields?: Array<{
      type: string;
      text: string;
    }>;
    elements?: Array<{
      type: string;
      text: string;
    }>;
  }>;
}

interface SlackMetadata {
  url?: string;
  type?: string;
  userEmail?: string;
  userName?: string;
  timezone?: string;
  postUrl?: string;
}

interface SlackBlock {
  type: string;
  text?: {
    type: string;
    text: string;
    emoji?: boolean;
  };
  fields?: Array<{
    type: string;
    text: string;
  }>;
  elements?: Array<{
    type: string;
    text: string;
  }>;
}

export async function sendSlackNotification(message: SlackMessage) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("SLACK_WEBHOOK_URL not configured, skipping notification");
    return;
  }

  try {
    console.log("📨 Sending Slack notification...");

    // Log the message being sent for debugging
    console.log("Slack message payload:", JSON.stringify(message, null, 2));

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error("❌ Slack API error response:", {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
      });

      throw new Error(
        `Failed to send Slack notification: ${response.status} ${response.statusText} - ${responseText}`,
      );
    }

    console.log("✅ Slack notification sent successfully!");
  } catch (error) {
    console.error("❌ Error sending Slack notification:", error);
    // Log additional details that might help debug the issue
    console.error("Webhook URL configured:", !!webhookUrl);
    console.error("Message had blocks:", message.blocks?.length || 0);
    console.error("Message had text:", !!message.text);
  }
}

// Helper function to format dates consistently with timezone awareness
function formatDate(date: Date, timezone?: string): string {
  // Ensure we have a timezone, default to Los Angeles
  const tz = timezone || "America/Los_Angeles";

  try {
    return new Date(date).toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: tz,
    });
  } catch (error) {
    console.error(`Error formatting date with timezone ${tz}:`, error);
    // Fallback to UTC if timezone is invalid
    return (
      new Date(date).toLocaleString("en-US", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "UTC",
      }) + " UTC"
    );
  }
}

// Helper function to get user's local time
function getLocalTime(date: Date, timezone?: string): string {
  const tz = timezone || "America/Los_Angeles";

  try {
    return (
      new Date(date).toLocaleTimeString("en-US", {
        timeStyle: "short",
        timeZone: tz,
      }) + ` (${tz})`
    );
  } catch (error) {
    console.error(`Error getting local time for timezone ${tz}:`, error);
    return (
      new Date(date).toLocaleTimeString("en-US", {
        timeStyle: "short",
        timeZone: "UTC",
      }) + " (UTC)"
    );
  }
}

// Helper function to get platform emoji
function getPlatformEmoji(platform: string): string {
  switch (platform.toLowerCase()) {
    case "twitter":
      return "🐦";
    case "linkedin":
      return "💼";
    case "hackernews":
      return "🗞️";
    default:
      return "📱";
  }
}

// Helper function to format error messages for better readability
function formatErrorMessage(error: string): {
  message: string;
  action?: string;
} {
  if (error.includes("duplicate content")) {
    return {
      message: "Twitter does not allow duplicate tweets.",
      action: "Please modify the content and try again.",
    };
  }
  if (error.includes("authentication failed")) {
    return {
      message: "Authentication error with social platform.",
      action: "Please reconnect your social account.",
    };
  }
  if (error.includes("permission denied")) {
    return {
      message: "Permission error with social platform.",
      action: "Please check your account permissions.",
    };
  }
  if (error.includes("media_id")) {
    return {
      message: "Error with media attachment.",
      action:
        "The image may have expired. Please try uploading the image again.",
    };
  }
  return { message: error };
}

export function createErrorNotification(error: {
  platform: string;
  content: string;
  errorMessage: string;
  scheduledFor: Date;
  metadata?: SlackMetadata;
}) {
  const userMention = error.metadata?.userEmail
    ? `<@${error.metadata.userEmail.split("@")[0]}>`
    : "Someone";
  const userName = error.metadata?.userName || userMention;
  const emoji = getPlatformEmoji(error.platform);
  const timezone = error.metadata?.timezone || "America/Los_Angeles";
  const localTime = getLocalTime(error.scheduledFor, timezone);
  const formattedError = formatErrorMessage(error.errorMessage);
  const platformName =
    error.platform.toLowerCase() === "twitter"
      ? "X (Twitter)"
      : error.platform.charAt(0).toUpperCase() + error.platform.slice(1);

  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `${emoji} Posting Error on ${platformName}`,
          emoji: true,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Hey ${userMention}, there was an error while trying to post your content.`,
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "*Error Details*\n" +
            formattedError.message +
            (formattedError.action ? `\n_${formattedError.action}_` : ""),
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Failed Content*\n" + error.content,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Scheduled For*\n${formatDate(error.scheduledFor, timezone)} (${localTime})`,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Posted by ${userName} • Error occurred at ${formatDate(new Date(), timezone)} • _You can retry this post from the Scheduled Posts page_`,
          },
        ],
      },
    ],
  };
}

export function createScheduledPostNotification(post: {
  platform: string;
  content: string;
  scheduledFor: Date;
  metadata?: SlackMetadata;
}) {
  const isHNReminder =
    post.platform === "hackernews" && post.metadata?.type === "reminder";
  const userMention = post.metadata?.userEmail
    ? `<@${post.metadata.userEmail.split("@")[0]}>`
    : "Someone";
  const userName = post.metadata?.userName || userMention;
  const emoji = getPlatformEmoji(post.platform);
  const timezone = post.metadata?.timezone || "America/Los_Angeles";
  const localTime = getLocalTime(post.scheduledFor, timezone);

  if (isHNReminder) {
    const submissionUrl = `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(post.metadata?.url || "")}&t=${encodeURIComponent(post.content)}`;

    return {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `${emoji} Hacker News Submission Ready`,
            emoji: true,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Hey ${userMention}! Your scheduled Hacker News submission is ready to go.`,
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: "*Title*\n" + post.content,
            },
          ],
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "*Article URL*\n" +
              `<${post.metadata?.url}|${post.metadata?.url}>`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Scheduled For*\n${formatDate(post.scheduledFor, timezone)} (${localTime})`,
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: ":point_right: *Ready to submit?* Click the link below:",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `<${submissionUrl}|:pencil2: *Submit to Hacker News*>`,
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `Scheduled by ${userName} • Notification sent at ${formatDate(new Date(), timezone)}`,
            },
          ],
        },
      ],
    };
  }

  // For Twitter and LinkedIn posts
  const platformName =
    post.platform.toLowerCase() === "twitter"
      ? "X (Twitter)"
      : post.platform.charAt(0).toUpperCase() + post.platform.slice(1);

  const blocks: SlackBlock[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `${emoji} ${platformName} Post Published`,
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Hey ${userMention}! Your post has been published successfully.`,
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: "*Content*\n" + post.content,
        },
      ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Published At*\n${formatDate(post.scheduledFor, timezone)} (${localTime})`,
      },
    },
  ];

  // Add post URL if available
  if (post.metadata?.postUrl) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*View Post*\n" +
          `<${post.metadata.postUrl}|:link: Click to view on ${post.platform}>`,
      },
    });
  }

  blocks.push({
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: `Posted by ${userName} • Notification sent at ${formatDate(new Date(), timezone)}`,
      },
    ],
  });

  return { blocks };
}

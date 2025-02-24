import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface PageContext {
  title: string;
  description: string;
  url: string;
  content?: string;
}

interface UserIntent {
  isGeneratingPost: boolean;
  isEditing: boolean;
  isAnalyzing: boolean;
}

// Function to analyze user intent
async function analyzeUserIntent(message: string): Promise<UserIntent> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `Analyze the user's message intent. Return ONLY a JSON object with these boolean fields:
- isGeneratingPost: true if user wants to create/generate a new post or modify existing one substantially
- isEditing: true if user wants to make minor edits to existing post
- isAnalyzing: true if user is asking for analysis, explanation, or suggestions`,
      },
      {
        role: "user",
        content: message,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0,
  });

  return JSON.parse(
    completion.choices[0].message.content ||
      '{"isGeneratingPost":false,"isEditing":false,"isAnalyzing":true}',
  );
}

// Function to generate platform-specific previews
async function generatePlatformPreviews(
  platforms: string[],
  pageContext: PageContext,
  aiResponse: string,
): Promise<Record<string, string>> {
  const previews: Record<string, string> = {};

  await Promise.all(
    platforms.map(async (platform) => {
      const platformPrompt = `Create a ${platform} post about this content. Your response must contain ONLY the post content, exactly as it should appear on ${platform}. Do not include any explanations, markdown, or additional text.

Page Context:
Title: ${pageContext.title}
URL: ${pageContext.url}

Previous conversation context: ${aiResponse}

Requirements:
- Return ONLY the post content
- No explanations or commentary
- No markdown formatting
- No "Here's a post" or similar prefixes
- Replace any URL placeholders like [YourArticleLinkHere] or [URL] with "${pageContext.url}"
- For LinkedIn: Only plain text with line breaks
- For Twitter: Plain text, max 280 characters
- Always include "${pageContext.url}" as the URL for any call to action`;

      const platformPreview = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `You are generating ONLY the content for a ${platform} post. Do not include any explanations, prefixes, or formatting. Return exactly what should appear in the post.

Format requirements:
${
  platform === "twitter"
    ? `- Maximum 280 characters
- Plain text only
- Include relevant hashtags
- Always include "${pageContext.url}" in the post
- Place URL where it makes most sense (typically at end)
- NEVER use placeholders like [YourArticleLinkHere] or [URL] - always use the actual URL "${pageContext.url}"
- Do not include any text in square brackets []`
    : `- Plain text only
- Use line breaks for paragraphs
- No markdown or bullet points
- Always include "${pageContext.url}" in the post
- Place URL where it makes most sense (typically after the main content)
- Include relevant hashtags at the end
- NEVER use placeholders like [YourArticleLinkHere] or [URL] - always use the actual URL "${pageContext.url}"
- Do not include any text in square brackets []`
}`,
          },
          {
            role: "user",
            content: platformPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: platform === "twitter" ? 200 : 500,
      });

      let postContent = platformPreview.choices[0].message.content || "";

      // Clean up any remaining formatting or prefixes
      postContent = postContent
        .replace(
          /^(Here['']s|This is|I['']ve created|Here is|Draft for|Post for)[^:]*/i,
          "",
        )
        .replace(/^[:\s-]+/, "")
        .replace(/^["'\s\n]+/, "")
        .replace(/["'\s\n]+$/, "")
        .replace(/\[Link to .*?\]/gi, pageContext.url)
        .replace(/\[URL\]/gi, pageContext.url)
        .trim();

      // For LinkedIn, ensure no markdown or special formatting remains
      if (platform === "linkedin") {
        postContent = postContent
          .replace(/[*_~`]/g, "")
          .replace(/^[-*+] /gm, "")
          .replace(/^\d+\. /gm, "")
          .replace(/\n{3,}/g, "\n\n")
          .trim();
      }

      // Ensure URL is included if it's not already
      if (!postContent.includes(pageContext.url)) {
        postContent =
          platform === "twitter"
            ? `${postContent}\n\n${pageContext.url}`
            : `${postContent}\n\nLearn more: ${pageContext.url}`;
      }

      previews[platform] = postContent;
    }),
  );

  return previews;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is not configured");
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 },
      );
    }

    const {
      message,
      pageContext,
      platforms,
      conversation,
      generateDistinctContent,
    } = await request.json();

    // Validate required fields
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }
    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json(
        { error: "Valid platforms array is required" },
        { status: 400 },
      );
    }
    if (!pageContext || !pageContext.title) {
      return NextResponse.json(
        { error: "Page context with title is required" },
        { status: 400 },
      );
    }

    const previews: Record<string, string> = {};

    for (const platform of platforms) {
      try {
        let systemPrompt = "";
        let userPrompt = message;

        if (platform === "twitter") {
          systemPrompt = `You are a social media expert specializing in Twitter. Your task is to help create engaging tweets that drive traffic and engagement.

Key requirements:
1. Keep tweets within 280 characters
2. Focus on clarity, impact, and call-to-action
3. ALWAYS use the exact URL "${pageContext.url}" - never use placeholders like [link], [url], or similar
4. Place the URL naturally in the tweet, typically at the end
5. Include relevant hashtags after the URL

Example format:
"Your engaging tweet content ${pageContext.url} #Hashtag1 #Hashtag2"`;
        } else if (platform === "linkedin") {
          systemPrompt = `You are a social media expert specializing in LinkedIn. Your task is to help create professional and engaging LinkedIn posts that resonate with a business audience. Focus on value proposition, industry insights, and professional tone.`;
        } else if (platform === "hackernews") {
          systemPrompt = `You are an expert at crafting Hacker News titles that resonate with the HN community. Your task is to help create titles that are:
1. Factual and accurate - no clickbait or sensationalism
2. Concise but descriptive
3. Technical when appropriate
4. Focused on what's intellectually interesting
5. Written in HN's characteristic direct style

The current title will be provided. Help improve it while maintaining accuracy and HN's posting guidelines.

IMPORTANT: Respond with ONLY the suggested title. No explanations or additional text.`;
          userPrompt = `Current title: "${pageContext.title}"
User request: ${message}

Remember to respond with ONLY the suggested title.`;
        }

        const messages = [
          { role: "system", content: systemPrompt },
          ...conversation.map((msg: { role: string; content: string }) => ({
            role: msg.role,
            content: msg.content,
          })),
          { role: "user", content: userPrompt },
        ];

        const response = await openai.chat.completions.create({
          model: "gpt-4-turbo-preview",
          messages,
          temperature: 0.7,
          max_tokens: platform === "hackernews" ? 100 : 500,
        });

        let content = response.choices[0].message.content || "";

        // Clean up any remaining placeholders or formatting
        content = content
          .replace(
            /^(Here['']s|This is|I['']ve created|Here is|Suggested title:|Title:|Draft:|New title:)[^:]*/i,
            "",
          )
          .replace(/^[:\s-]+/, "")
          .replace(/^["'\s\n]+/, "")
          .replace(/["'\s\n]+$/, "")
          .replace(/\[link\]/gi, pageContext.url)
          .replace(/\[url\]/gi, pageContext.url)
          .replace(/\[.*?link.*?\]/gi, pageContext.url)
          .trim();

        // Ensure URL is included if it's not already
        if (!content.includes(pageContext.url)) {
          content =
            platform === "twitter"
              ? `${content.replace(/\s+#/g, ` ${pageContext.url} #`)}` // Insert URL before hashtags
              : `${content}\n\nLearn more: ${pageContext.url}`;
        }

        previews[platform] = content;

        if (!generateDistinctContent) {
          // Use the first generated content for all platforms
          const firstContent = Object.values(previews)[0];
          platforms.forEach((p) => {
            previews[p] = firstContent;
          });
          break;
        }
      } catch (error) {
        console.error(`Error generating content for ${platform}:`, error);
        throw new Error(
          `Failed to generate content for ${platform}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }

    return NextResponse.json({
      previews,
      response:
        conversation.length > 0
          ? previews[platforms[0]]
          : "Generated content for all platforms.",
      intent: { isGeneratingPost: true, isEditing: false, isAnalyzing: false },
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate content",
        response:
          "Sorry, I encountered an error while generating content. Please try again.",
      },
      { status: 500 },
    );
  }
}

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
- Include "${pageContext.url}" as the URL for any call to action
- For LinkedIn: Only plain text with line breaks
- For Twitter: Plain text, max 280 characters
- Always include the URL in the post`;

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
- Place URL where it makes most sense (typically at end)`
    : `- Plain text only
- Use line breaks for paragraphs
- No markdown or bullet points
- Always include "${pageContext.url}" in the post
- Place URL where it makes most sense (typically after the main content)
- Include relevant hashtags at the end`
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

    const body = await request.json();
    const { message, pageContext, platforms, conversation } = body as {
      message: string;
      pageContext: PageContext;
      platforms: string[];
      conversation: Message[];
    };

    // Validate required fields
    if (!message || !pageContext || !platforms || !conversation) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Analyze user intent
    const intent = await analyzeUserIntent(message);

    // Build system message with context and platform-specific instructions
    const systemMessage = `You are an AI marketing assistant helping to create social media posts. 
You have access to the following page context:

Title: ${pageContext.title}
Description: ${pageContext.description}
URL: ${pageContext.url}
${pageContext.content ? `Content: ${pageContext.content.substring(0, 500)}...` : ""}

Your task is to help create engaging social media posts optimized for ${platforms[0]}.

Platform-specific formatting guidelines:

For Twitter:
- Maximum 280 characters
- Use plain text only (no markdown)
- URLs are automatically shortened
- Hashtags using # (use strategically, not excessively)
- @mentions for relevant accounts
- Emojis are supported
- Line breaks are supported (use sparingly)
- No bullet points or other formatting

For LinkedIn:
- Plain text only (no markdown)
- URLs are automatically linked
- Hashtags using # (use professionally, typically at the end)
- @mentions for companies/people
- Emojis are supported (use professionally)
- Line breaks for paragraphs (double line break)
- No bullet points or other formatting
- Keep paragraphs concise for readability

When responding:
1. Provide your suggestions and ideas in a conversational way
2. When generating a post, provide it in exactly the format it would appear on the platform
3. Do not use any markdown formatting
4. Focus on the specific features and limitations of the selected platform
5. If the user has edited a previous version, maintain their style while improving the content

Remember: Generate content exactly as it would appear on the platform - no markdown, no special formatting beyond what the platform natively supports.`;

    // Prepare conversation history
    const messages = [
      { role: "system", content: systemMessage },
      ...conversation.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    // Call OpenAI API for main response
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Extract response
    const aiResponse = completion.choices[0].message.content || "";

    // Generate platform-specific previews only if we're creating/editing a post
    let previews: Record<string, string> = {};
    if (intent.isGeneratingPost || intent.isEditing) {
      previews = await generatePlatformPreviews(
        platforms,
        pageContext,
        aiResponse,
      );
    }

    return NextResponse.json({
      response: aiResponse,
      previews,
      intent,
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 },
    );
  }
}

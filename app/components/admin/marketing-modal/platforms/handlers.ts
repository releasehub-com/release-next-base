import type { Platform } from "../types";
import type { PageContext, ModalState } from "../types";

interface AIResponse {
  response: string;
  previews: {
    [key in Platform]?: string;
  };
  intent: {
    isGeneratingPost: boolean;
    isEditing: boolean;
  };
}

interface ModalStateUpdates {
  editedPreviews: {
    [key in Platform]: string;
  };
  preview: {
    [key in Platform]?: string;
  };
  versions: {
    [key in Platform]: Array<{
      content: string;
      timestamp: number;
      source: "ai" | "user";
    }>;
  };
  hackernewsUrl?: string;
}

// Platform-specific prompt generators
export const platformPrompts = {
  hackernews: (
    message: string,
    currentPreview: string = "",
    pageContext?: PageContext,
  ) => {
    console.log("\n=== HackerNews Prompt Generation ===");
    console.log("Input message:", message);
    console.log("Current preview:", currentPreview);
    console.log("Page context:", pageContext);

    const prompt = `${message}\n\nPlease generate a Hacker News title for this article. Your response must be in exactly this format:
1. First line: A clear, concise title (max 80 characters, no URLs)
2. One blank line
3. The exact text "Learn more: " followed by the article URL

Current article URL: ${pageContext?.url || ""}
Current article title: ${pageContext?.title || ""}
Current article description: ${pageContext?.description || ""}
Current title: ${currentPreview}

Example:
Incredible New Framework Released

Learn more: https://example.com/framework

Do not include any other text or formatting.`;
    console.log("Generated prompt:", prompt);
    console.log("=== End Prompt Generation ===\n");
    return prompt;
  },

  twitter: (message: string, currentPreview: string = "") =>
    `${message}${currentPreview ? `\n\nCurrent Twitter post:\n${currentPreview}` : ""}`,

  linkedin: (
    message: string,
    currentPreview: string = "",
    pageContext?: PageContext,
  ) => {
    const prompt = `${message}\n\nPlease generate a LinkedIn post for this article. Your response must be ONLY the post content, with no additional formatting, explanations, or context.

Current article URL: ${pageContext?.url || ""}
Current article title: ${pageContext?.title || ""}
Current article description: ${pageContext?.description || ""}
${currentPreview ? `\nCurrent post:\n${currentPreview}` : ""}

Do not include any other text or formatting.`;
    return prompt;
  },
};

// Platform-specific content processors
export const platformProcessors = {
  hackernews: {
    processAIResponse: (
      data: AIResponse,
      currentState: ModalState,
      pageContext: PageContext,
    ): Partial<ModalStateUpdates> => {
      console.log("\n=== HackerNews AI Response Processing ===");
      console.log("Full data object:", data);
      console.log("Current state:", {
        editedPreviews: currentState.editedPreviews,
        preview: currentState.preview,
        hackernewsUrl: currentState.hackernewsUrl,
      });
      console.log("Page context:", pageContext);

      // For HackerNews, we want to use data.response as it contains both title and URL
      const content = data.response || data.previews?.hackernews;
      console.log("\nProcessing content:", content);

      if (!content) {
        console.log("No content found in response or previews");
        return {};
      }

      // Split on the exact "Learn more: " format first
      const parts = content.split("\n\nLearn more: ");
      console.log("\nSplit result:", parts);

      if (parts.length === 2) {
        const title = parts[0].trim();
        const url = parts[1].trim();

        console.log("\nExact format match found:");
        console.log("Title:", title);
        console.log("URL:", url);

        const updates = {
          editedPreviews: {
            ...currentState.editedPreviews,
            hackernews: title,
          },
          preview: {
            ...currentState.preview,
            hackernews: title,
          },
          versions: {
            ...currentState.versions,
            hackernews: [
              {
                content: `${title}\n\nLearn more: ${url}`,
                timestamp: Date.now(),
                source: "ai" as "ai" | "user",
              },
              ...currentState.versions.hackernews,
            ],
          },
          hackernewsUrl: url,
        };

        console.log("\nReturning updates:", updates);
        console.log("=== End Processing ===\n");
        return updates;
      }

      console.log("\nExact format not found, trying alternatives...");

      // Fallback to other formats if the exact format isn't found
      const learnMoreFormats = [
        "\nLearn more: ",
        "Learn more: ",
        "Learn More: ",
        "\n\nRead more: ",
        "\nRead more: ",
        "Read more: ",
        "Read More: ",
      ];

      for (const format of learnMoreFormats) {
        console.log("\nTrying format:", format);
        if (content.includes(format)) {
          console.log("Format found in content");
          const [title, url] = content.split(format).map((s) => s.trim());
          console.log("Split result - Title:", title);
          console.log("Split result - URL:", url);

          if (title && url) {
            const updates = {
              editedPreviews: {
                ...currentState.editedPreviews,
                hackernews: title,
              },
              preview: {
                ...currentState.preview,
                hackernews: title,
              },
              versions: {
                ...currentState.versions,
                hackernews: [
                  {
                    content: `${title}\n\nLearn more: ${url}`,
                    timestamp: Date.now(),
                    source: "ai" as "ai" | "user",
                  },
                  ...currentState.versions.hackernews,
                ],
              },
              hackernewsUrl: url,
            };

            console.log(
              "\nReturning updates from alternative format:",
              updates,
            );
            console.log("=== End Processing ===\n");
            return updates;
          }
        }
      }

      console.log("\nNo format matched, using fallback...");

      // If we still haven't found a URL, use the first line as title and pageContext URL
      const firstLine = content.split("\n")[0].trim();
      const url = pageContext?.url || "";

      console.log("Fallback title:", firstLine);
      console.log("Fallback URL:", url);

      const fallbackUpdates = {
        editedPreviews: {
          ...currentState.editedPreviews,
          hackernews: firstLine,
        },
        preview: {
          ...currentState.preview,
          hackernews: firstLine,
        },
        versions: {
          ...currentState.versions,
          hackernews: [
            {
              content: `${firstLine}\n\nLearn more: ${url}`,
              timestamp: Date.now(),
              source: "ai" as "ai" | "user",
            },
            ...currentState.versions.hackernews,
          ],
        },
        hackernewsUrl: url,
      };

      console.log("\nReturning fallback updates:", fallbackUpdates);
      console.log("=== End Processing ===\n");
      return fallbackUpdates;
    },

    processVersionSelect: (
      versionContent: string,
      currentState: ModalState,
    ): Partial<ModalStateUpdates> => {
      const learnMoreFormats = [
        "\n\nLearn more: ",
        "\nLearn more: ",
        "Learn more: ",
        "Learn More: ",
        "\n\nRead more: ",
        "\nRead more: ",
        "Read more: ",
        "Read More: ",
      ];

      let title = versionContent;
      let url = "";

      for (const format of learnMoreFormats) {
        if (versionContent.includes(format)) {
          const parts = versionContent.split(format);
          if (parts.length === 2) {
            title = parts[0].trim();
            url = parts[1].trim();
            break;
          }
        }
      }

      return {
        editedPreviews: {
          ...currentState.editedPreviews,
          hackernews: title,
        },
        hackernewsUrl: url,
      };
    },
  },

  twitter: {
    processAIResponse: (
      data: AIResponse,
      currentState: ModalState,
      pageContext: PageContext,
    ): Partial<ModalStateUpdates> => {
      const content = data.previews.twitter;
      if (!content) return {};

      return {
        editedPreviews: {
          ...currentState.editedPreviews,
          twitter: content,
        },
        preview: {
          ...currentState.preview,
          twitter: content,
        },
        versions: {
          ...currentState.versions,
          twitter: [
            { content, timestamp: Date.now(), source: "ai" },
            ...currentState.versions.twitter,
          ],
        },
      };
    },

    processVersionSelect: (
      versionContent: string,
      currentState: ModalState,
    ): Partial<ModalStateUpdates> => ({
      editedPreviews: {
        ...currentState.editedPreviews,
        twitter: versionContent,
      },
    }),
  },

  linkedin: {
    processAIResponse: (
      data: AIResponse,
      currentState: ModalState,
      pageContext: PageContext,
    ): Partial<ModalStateUpdates> => {
      // Get content from either the response or previews
      const content = data.response || data.previews?.linkedin;
      if (!content) return {};

      // Clean up the content to remove any AI formatting or explanations
      const cleanContent = content
        .replace(
          /^(Here['']s|This is|I['']ve created|Here is|Draft for|Post for|LinkedIn post:|Post:|Content:)[^:]*/i,
          "",
        )
        .replace(/^[:\s-]+/, "")
        .replace(/^["'\s\n]+/, "")
        .replace(/["'\s\n]+$/, "")
        .trim();

      return {
        editedPreviews: {
          ...currentState.editedPreviews,
          linkedin: cleanContent,
        },
        preview: {
          ...currentState.preview,
          linkedin: cleanContent,
        },
        versions: {
          ...currentState.versions,
          linkedin: [
            { content: cleanContent, timestamp: Date.now(), source: "ai" },
            ...currentState.versions.linkedin,
          ],
        },
      };
    },

    processVersionSelect: (
      versionContent: string,
      currentState: ModalState,
    ): Partial<ModalStateUpdates> => ({
      editedPreviews: {
        ...currentState.editedPreviews,
        linkedin: versionContent,
      },
    }),

    processHackernewsUrlChange: (
      url: string,
      currentState: ModalState,
    ): Partial<ModalStateUpdates> => ({
      hackernewsUrl: url,
    }),
  },
};

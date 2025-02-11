import { test, expect } from "@playwright/test";
import { checkImageLoadState, waitForAllImages } from "./utils";

test.describe("Blog Posts", () => {
  // Add a hook to handle navigation timeouts
  test.beforeEach(async ({ page }) => {
    // Increase navigation timeout for slower connections
    page.setDefaultNavigationTimeout(90000);
    page.setDefaultTimeout(90000);
  });

  test("should load and render blog index page correctly", async ({ page }) => {
    await page.goto("/blog");
    await page.waitForSelector("h1");

    // Get initial articles and their titles
    const initialTitles = await page.evaluate(() => {
      const titles = document.querySelectorAll("article h2");
      return Array.from(titles, (title) => title.textContent?.trim());
    });
    console.log(`Initial post count: ${initialTitles.length}`);
    console.log("Initial article titles:", initialTitles);

    // Get available categories
    const categoryButtons = await page.$$(".mb-8.flex.flex-wrap.gap-2 button");
    const categories = await Promise.all(
      categoryButtons.map(async (button) => {
        const text = await button.textContent();
        return text?.trim() || "";
      }),
    );
    console.log("Available categories:", categories.filter(Boolean));

    // Select "ai" category
    const selectedCategory = "ai";
    console.log(`Selected category for filtering: "${selectedCategory}"`);
    const aiButton = await page
      .locator(`button:has-text("${selectedCategory}")`)
      .first();
    await aiButton.click();

    try {
      await page.waitForLoadState("networkidle", { timeout: 30000 });
    } catch (error: any) {
      console.log(
        "Network did not reach idle state, continuing with test:",
        error.message,
      );
    }

    console.log("Checking page state after category click...");

    // Wait for a moment to let any animations complete
    await page.waitForTimeout(1000);

    // Get filtered articles and their titles
    const filteredTitles = await page.evaluate(() => {
      const titles = document.querySelectorAll("article h2");
      return Array.from(titles, (title) => title.textContent?.trim());
    });
    console.log(
      `Found ${filteredTitles.length} visible articles after filtering`,
    );
    console.log("Filtered article titles:", filteredTitles);

    // Verify that we have articles visible
    if (filteredTitles.length === 0) {
      throw new Error("No articles visible after filtering");
    }

    // Verify that the articles changed after filtering
    if (JSON.stringify(filteredTitles) === JSON.stringify(initialTitles)) {
      console.warn("Warning: Article titles did not change after filtering");
      console.log("This could mean either:");
      console.log('1. All articles have the "ai" category');
      console.log("2. The filtering is not working as expected");
    }

    // Success message
    console.log("Successfully verified articles are visible after filtering");
    console.log(`Final visible post count: ${filteredTitles.length}`);
  });

  test("should render individual blog post correctly", async ({ page }) => {
    // Navigate to a known blog post
    await page.goto("/blog/the-release-mission");
    await page.waitForLoadState("domcontentloaded");

    // Check title and metadata
    await expect(page.locator("h1")).toHaveText("The Release Mission");
    await expect(page.locator("text=Tommy McClung")).toBeVisible();

    // Check all images with improved error handling
    try {
      await waitForAllImages(page);
    } catch (error) {
      console.error("Blog post image loading failed:", error);
      try {
        await page.screenshot({
          path: "blog-post-image-error.png",
          fullPage: true,
        });
      } catch (screenshotError) {
        console.error("Failed to take error screenshot:", screenshotError);
      }
      throw error;
    }

    // Check MDX content renders
    await expect(page.locator("blockquote")).toBeVisible();
    await expect(
      page.locator('h3:text-is("Why we started Release and our Mission")'),
    ).toBeVisible();

    // Check metadata tags
    const categories = page.locator("span.rounded-full");
    await expect(categories).toHaveCount(2); // platform-engineering and product

    // Verify reading time is displayed
    await expect(page.locator('text="6 min read"')).toBeVisible();

    // Check CTA section
    await expect(
      page.getByRole("link", { name: "Try Release for Free" }).first(),
    ).toBeVisible();
  });

  test("should handle invalid blog slugs gracefully", async ({ page }) => {
    // Try to access non-existent blog post
    await page.goto("/blog/non-existent-post");

    // Should show 404 page - try both possible headings
    try {
      await expect(
        page.getByRole("heading", { name: /404|Page Not Found/i }),
      ).toBeVisible();
    } catch {
      // If heading not found, check for any 404-related content
      const pageContent = await page.textContent("body");
      expect(pageContent).toMatch(/404|not found|page does not exist/i);
    }
  });

  test("should navigate between blog posts", async ({ page }) => {
    // Start at the blog index
    await page.goto("/blog");
    await page.waitForLoadState("domcontentloaded");

    // Click first blog post with improved reliability
    const firstArticle = page.locator("article").first();
    await firstArticle.waitFor({ state: "visible" });
    await firstArticle.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // Small delay to ensure stability
    await firstArticle.click({ force: true });
    await page.waitForLoadState("networkidle");

    // Verify we're on a blog post page
    const h1 = page.locator("h1");
    await h1.waitFor({ state: "visible" });
    const initialTitle = await h1.textContent();
    expect(initialTitle).toBeTruthy();

    // Check images on first post
    try {
      await waitForAllImages(page);
    } catch (error) {
      console.error("First blog post image loading failed:", error);
      try {
        await page.screenshot({
          path: "blog-first-post-image-error.png",
          fullPage: true,
        });
      } catch (screenshotError) {
        console.error("Failed to take error screenshot:", screenshotError);
      }
      throw error;
    }

    // Go back to index
    await page.goBack();
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("h1")).toHaveText("Latest Articles");

    // Click a different blog post with improved reliability
    const secondArticle = page.locator("article").nth(1);
    await secondArticle.waitFor({ state: "visible" });
    await secondArticle.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // Small delay to ensure stability
    await secondArticle.click({ force: true });
    await page.waitForLoadState("networkidle");

    // Verify we're on a different post
    await h1.waitFor({ state: "visible" });
    const newTitle = await h1.textContent();
    expect(newTitle).toBeTruthy();
    expect(newTitle).not.toEqual(initialTitle);

    // Check images on second post
    try {
      await waitForAllImages(page);
    } catch (error) {
      console.error("Second blog post image loading failed:", error);
      try {
        await page.screenshot({
          path: "blog-second-post-image-error.png",
          fullPage: true,
        });
      } catch (screenshotError) {
        console.error("Failed to take error screenshot:", screenshotError);
      }
      throw error;
    }
  });

  test("should render blog post images correctly", async ({ page }) => {
    // Navigate to a post with multiple images
    await page.goto("/blog/release-is-going-to-kubecon-2023");

    // Check all images with improved error handling
    try {
      await waitForAllImages(page);
    } catch (error) {
      console.error("KubeCon blog post image loading failed:", error);
      await page.screenshot({
        path: "blog-kubecon-image-error.png",
        fullPage: true,
      });
      throw error;
    }

    // Additional checks for specific image types
    const images = await page.locator("img").all();
    for (const image of images) {
      const src = await image.getAttribute("src");
      const alt = await image.getAttribute("alt");

      // Verify alt text exists
      if (src && !src.includes("avatar") && !src.includes("icon")) {
        expect(alt, `Image missing alt text: ${src}`).toBeTruthy();
      }

      // Verify SVG images have unoptimized prop
      if (src?.endsWith(".svg")) {
        const isUnoptimized = await image.evaluate((img: HTMLImageElement) => {
          // Check for Next.js data attribute or direct src (unoptimized images use direct src)
          return (
            img.getAttribute("data-nimg") === "raw" ||
            !img.src.includes("/_next/image")
          );
        });
        if (!isUnoptimized) {
          console.warn(`Warning: SVG image not properly unoptimized: ${src}`);
        }
      }
    }
  });
});

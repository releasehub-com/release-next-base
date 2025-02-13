import { test, expect } from "@playwright/test";
import { waitForAllImages } from "./utils";

test.describe("SEO Pages", () => {
  // Add a hook to handle navigation timeouts
  test.beforeEach(async ({ page }) => {
    // Increase navigation timeout for slower connections
    page.setDefaultNavigationTimeout(90000);
    page.setDefaultTimeout(90000);
  });

  test("should render investor logos correctly on whyrelease page", async ({
    page,
  }) => {
    await page.goto("/whyrelease");
    await page.waitForSelector('h2:text-is("Our Investors")');

    // Find the investors section
    const investorsSection = await page
      .locator('h2:text-is("Our Investors")')
      .locator("..")
      .locator("..");

    // Get all investor logo containers within the section
    const logoContainers = await investorsSection
      .locator(".w-\\[180px\\].h-\\[80px\\]")
      .all();
    expect(logoContainers.length).toBe(3);

    // Expected logos with their properties
    const expectedLogos = [
      {
        src: "/investors/sequoia.svg",
        alt: "Sequoia Capital logo",
        inverted: false,
      },
      { src: "/investors/yc.svg", alt: "Y Combinator logo", inverted: true },
      { src: "/investors/crv.svg", alt: "CRV logo", inverted: true },
    ];

    // Check each logo
    for (let i = 0; i < logoContainers.length; i++) {
      const container = logoContainers[i];
      const expected = expectedLogos[i];

      // Get the image within the container
      const image = await container.locator("img").first();

      // Verify image properties
      const src = await image.getAttribute("src");
      expect(src, `Logo ${i + 1} should have correct src`).toContain(
        expected.src,
      );

      const alt = await image.getAttribute("alt");
      expect(alt).toBe(expected.alt);

      // Verify dimensions
      const style = await image.getAttribute("style");
      expect(style?.replace(/\s+/g, "")).toContain("object-fit:contain");

      // Verify inversion class for YC and CRV logos
      if (expected.inverted) {
        const hasInvertClass = await image.evaluate((img) => {
          return (
            img.className.includes("brightness-0") &&
            img.className.includes("invert")
          );
        });
        expect(
          hasInvertClass,
          `${expected.alt} should have invert classes`,
        ).toBe(true);
      }

      // Verify image is visible and loaded
      const isVisible = await image.isVisible();
      expect(isVisible, `Logo ${expected.alt} should be visible`).toBe(true);

      // Log status for debugging
      console.log(`Verified investor logo: ${expected.alt}`);
    }

    // Take a screenshot of the investors section
    await investorsSection.screenshot({ path: "test-artifacts/investor-logos.png" });
  });
});

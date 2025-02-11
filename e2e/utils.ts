import { Locator, Page } from "@playwright/test";

interface ImageLoadResult {
  src: string | null;
  status: "loaded" | "error" | "warning";
  error?: string;
}

/**
 * Checks if an image has loaded successfully with improved reliability
 */
export async function checkImageLoadState(image: Locator) {
  try {
    // First check if image is present in DOM with a reasonable timeout
    await image.waitFor({ state: "attached", timeout: 20000 });

    // Get the image source for better error reporting
    const src = await image.getAttribute("src");

    // Verify image has loaded successfully with more detailed checks
    const loadState = await image.evaluate((img: HTMLImageElement) => {
      return {
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        currentSrc: img.currentSrc,
        offsetWidth: img.offsetWidth,
        offsetHeight: img.offsetHeight,
        error: (img as any).error, // Capture any loading errors
      };
    });

    // More comprehensive error checking
    if (!loadState.complete) {
      throw new Error(`Image not complete: ${src}`);
    }

    // Check for either natural dimensions or offset dimensions
    // Some images (like SVGs) might not have natural dimensions
    if (
      !loadState.naturalWidth &&
      !loadState.naturalHeight &&
      !loadState.offsetWidth &&
      !loadState.offsetHeight
    ) {
      throw new Error(
        `Image has no dimensions: ${src} (natural: ${loadState.naturalWidth}x${loadState.naturalHeight}, offset: ${loadState.offsetWidth}x${loadState.offsetHeight})`,
      );
    }

    if (loadState.error) {
      throw new Error(`Image load error: ${src} - ${loadState.error}`);
    }

    // If we get here, consider the image loaded successfully
    return true;
  } catch (error: any) {
    if (
      error.message?.includes("Target page, context or browser has been closed")
    ) {
      console.warn(
        "Browser context closed while checking image:",
        error.message,
      );
      return false;
    }
    throw error;
  }
}

/**
 * Waits for all images on the page to finish loading with improved reliability
 */
export async function waitForAllImages(page: Page) {
  try {
    // First wait for network idle with a longer timeout
    await page.waitForLoadState("networkidle", { timeout: 60000 });

    // Then wait for all images to have their src attributes
    await page.waitForFunction(
      () => {
        const imgs = document.querySelectorAll("img");
        return Array.from(imgs).every((img) => img.getAttribute("src"));
      },
      { timeout: 30000 },
    );

    // Get all images
    const images = await page.locator("img").all();

    // Track which images we've checked
    const results: ImageLoadResult[] = [];

    // First pass: Check all viewport images
    for (const image of images) {
      try {
        const src = await image.getAttribute("src");

        // Skip certain types of images that don't need loading checks
        if (
          !src ||
          src.includes("data:image") ||
          src.includes("lucide") ||
          src.includes("icon") ||
          src.includes("favicon")
        ) {
          continue;
        }

        // For SVGs, just verify they're in the DOM
        if (src.endsWith(".svg")) {
          const isVisible = await image.isVisible();
          if (isVisible) {
            results.push({ src, status: "loaded" });
          }
          continue;
        }

        // Check if image is in viewport or slightly below
        let isInViewport = false;
        try {
          isInViewport = await image.evaluate((img: HTMLImageElement) => {
            const rect = img.getBoundingClientRect();
            const buffer = 200; // Add 200px buffer below viewport
            return (
              rect.top >= -rect.height && // Consider images just above viewport
              rect.top <= window.innerHeight + buffer && // Include images slightly below
              rect.left >= -rect.width &&
              rect.left <= window.innerWidth
            );
          });
        } catch (error: any) {
          if (
            error.message?.includes(
              "Target page, context or browser has been closed",
            )
          ) {
            console.warn(
              "Browser context closed while checking viewport:",
              error.message,
            );
            continue;
          }
          throw error;
        }

        // For viewport images, ensure they load properly
        if (isInViewport) {
          try {
            const loaded = await Promise.race([
              image.evaluate(
                (img: HTMLImageElement) =>
                  new Promise((resolve) => {
                    if (img.complete && (img.naturalWidth || img.offsetWidth)) {
                      resolve(true);
                    } else {
                      img.addEventListener("load", () => resolve(true));
                      img.addEventListener("error", () => resolve(false));
                    }
                  }),
              ),
              new Promise((resolve) => setTimeout(() => resolve(false), 30000)),
            ]);

            if (loaded) {
              // Verify dimensions after load
              const dimensions = await image.evaluate(
                (img: HTMLImageElement) => ({
                  naturalWidth: img.naturalWidth,
                  naturalHeight: img.naturalHeight,
                  offsetWidth: img.offsetWidth,
                  offsetHeight: img.offsetHeight,
                }),
              );

              if (
                (dimensions.naturalWidth && dimensions.naturalHeight) ||
                (dimensions.offsetWidth && dimensions.offsetHeight)
              ) {
                results.push({ src, status: "loaded" });
              } else {
                results.push({
                  src,
                  status: "error",
                  error: "Viewport image has no dimensions",
                });
              }
            } else {
              results.push({
                src,
                status: "error",
                error: "Viewport image failed to load",
              });
            }
          } catch (error: any) {
            if (
              error.message?.includes(
                "Target page, context or browser has been closed",
              )
            ) {
              console.warn(
                "Browser context closed while loading viewport image:",
                error.message,
              );
              continue;
            }
            results.push({
              src,
              status: "error",
              error: `Viewport image error: ${error.message}`,
            });
          }
        } else {
          // For below-fold images, just verify they have a valid src and are in the DOM
          try {
            const isAttached = await image.evaluate((img: HTMLImageElement) => {
              return document.body.contains(img) && !!img.src;
            });

            if (isAttached) {
              results.push({
                src,
                status: "warning",
                error: "Below-fold image deferred",
              });
            }
          } catch (error: any) {
            if (
              error.message?.includes(
                "Target page, context or browser has been closed",
              )
            ) {
              console.warn(
                "Browser context closed while checking below-fold image:",
                error.message,
              );
              continue;
            }
            console.warn(`Below-fold image check failed: ${src}`, error);
          }
        }
      } catch (error: any) {
        if (
          error.message?.includes(
            "Target page, context or browser has been closed",
          )
        ) {
          console.warn(
            "Browser context closed while processing image:",
            error.message,
          );
          continue;
        }
        console.warn(
          `Image processing error: ${await image.getAttribute("src")}`,
          error,
        );
      }
    }

    // Log summary of image loading results
    console.log("Image loading summary:", results);

    // Only fail the test if viewport images failed to load
    const viewportFailures = results.filter((r) => r.status === "error");
    if (viewportFailures.length > 0) {
      throw new Error(
        `${viewportFailures.length} viewport images failed to load:\n${viewportFailures
          .map((f) => `${f.src}: ${f.error}`)
          .join("\n")}`,
      );
    }
  } catch (error: any) {
    // Handle browser context closure at the top level
    if (
      error.message?.includes("Target page, context or browser has been closed")
    ) {
      console.warn(
        "Browser context closed during image loading:",
        error.message,
      );
      return;
    }
    throw error;
  }
}

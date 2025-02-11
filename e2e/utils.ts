import { Locator, Page } from "@playwright/test";

interface ImageLoadResult {
  src: string | null;
  status: "loaded" | "error" | "warning";
  error?: string;
}

/**
 * Checks if an image has loaded successfully with improved reliability
 */
export async function checkImageLoadState(image: Locator): Promise<ImageLoadResult> {
  try {
    // First check if image is present in DOM with a reasonable timeout
    await image.waitFor({ state: "attached", timeout: 20000 });

    // Get the image source for better error reporting
    const src = await image.getAttribute('src');
    if (!src) {
      return { src: null, status: 'error', error: 'No src attribute' };
    }

    // Verify image has loaded successfully with more detailed checks
    const loadState = await image.evaluate((img: HTMLImageElement) => {
      return {
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        currentSrc: img.currentSrc,
        offsetWidth: img.offsetWidth,
        offsetHeight: img.offsetHeight,
      };
    });

    // More comprehensive error checking
    if (!loadState.complete) {
      return { src, status: 'error', error: 'Image not complete' };
    }

    // Check for either natural dimensions or offset dimensions
    if (
      !loadState.naturalWidth &&
      !loadState.naturalHeight &&
      !loadState.offsetWidth &&
      !loadState.offsetHeight
    ) {
      return { 
        src, 
        status: 'error', 
        error: `Image has no dimensions (natural: ${loadState.naturalWidth}x${loadState.naturalHeight}, offset: ${loadState.offsetWidth}x${loadState.offsetHeight})`
      };
    }

    return { src, status: 'loaded' };
  } catch (error) {
    return { 
      src: await image.getAttribute('src') || null, 
      status: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Waits for all images on the page to finish loading with improved reliability
 */
export async function waitForAllImages(page: Page) {
  try {
    // First wait for network idle with a longer timeout
    try {
      await page.waitForLoadState("networkidle", { timeout: 60000 });
    } catch (error) {
      console.warn("Network did not reach idle state, continuing with image checks:", error);
    }

    // Then wait for all images to have their src attributes and either be complete or lazy loaded
    await page.waitForFunction(
      () => {
        const images = document.querySelectorAll('img');
        return Array.from(images).every(img => {
          if (img.getAttribute('loading') === 'lazy') return true;
          return img.complete && (img.naturalWidth > 0 || img.offsetWidth > 0);
        });
      },
      { timeout: 30000 }
    );

    // Get all images and check their load state
    const images = await page.locator('img').all();
    const results: ImageLoadResult[] = [];

    for (const image of images) {
      const src = await image.getAttribute('src');
      if (!src) continue;

      const isLazy = await image.getAttribute('loading') === 'lazy';
      if (isLazy) {
        results.push({ src, status: 'warning', error: 'Lazy-loaded image deferred' });
        continue;
      }

      const loadState = await checkImageLoadState(image);
      results.push(loadState);
    }

    // Log summary
    console.log('Image loading summary:', results);

    return results;
  } catch (error) {
    console.error('Error in waitForAllImages:', error);
    throw error;
  }
}

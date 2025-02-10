import { Locator, Page } from '@playwright/test';

/**
 * Checks if an image has loaded successfully
 */
export async function checkImageLoadState(image: Locator) {
  // Check if image is present in DOM
  await image.waitFor({ state: 'attached' });
  
  // Verify image has loaded successfully
  const loadState = await image.evaluate((img: HTMLImageElement) => {
    if (!img.complete) {
      return 'loading';
    }
    if (!img.naturalWidth) {
      return 'error';
    }
    return 'loaded';
  });
  
  if (loadState !== 'loaded') {
    throw new Error(`Image failed to load: ${await image.getAttribute('src')}`);
  }
}

/**
 * Waits for all images on the page to finish loading
 */
export async function waitForAllImages(page: Page) {
  await page.waitForLoadState('networkidle', { timeout: 30000 });
  
  // Get all images that are currently visible in viewport
  const images = await page.locator('img:visible').all();
  
  // Check each visible image
  for (const image of images) {
    try {
      await checkImageLoadState(image);
    } catch (error: any) {
      console.warn(`Warning: ${error.message}`);
    }
  }
} 
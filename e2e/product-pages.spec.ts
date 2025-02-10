import { test, expect, Page } from '@playwright/test';

// Constants for image checking
const IMAGE_CHECK_TIMEOUT = 45000;
const NETWORK_IDLE_TIMEOUT = 45000;
const SCROLL_INTERVAL = 100;
const SCROLL_DISTANCE = 100;

// Types for image checking
interface ImageLoadState {
  complete: boolean;
  naturalWidth: number;
  naturalHeight: number;
  currentSrc: string;
  offsetWidth: number;
  offsetHeight: number;
  loading: string;
  decoding: string;
  crossOrigin: string | null;
  sizes: string;
  srcset: string;
  isInViewport: boolean;
}

interface ImageCheckOptions {
  skipTypes?: string[];
  checkSrcExists?: boolean;
  requireAlt?: boolean;
}

// Helper function to determine if an image should be skipped
function shouldSkipImage(className: string | null, alt: string | null, src: string | null): boolean {
  if (!src) return true;
  
  const skipClasses = ['lucide', 'w-5 h-5', 'w-6 h-6', 'w-16 h-16'];
  const hasSkipClass = className ? skipClasses.some(cls => className.includes(cls)) : false;
  const isIconNotLogo = className ? (className.includes('icon') && !src.includes('logo')) : false;
  
  return hasSkipClass || alt === '' || isIconNotLogo;
}

// Helper function to check viewport intersection
async function isInViewport(page: Page, element: any): Promise<boolean> {
  return await page.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= -rect.height &&
      rect.left >= -rect.width &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + rect.height &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) + rect.width
    );
  }, element);
}

// Helper function to scroll the page
async function autoScroll(page: Page): Promise<void> {
  await page.evaluate(
    async ({ interval, distance }) => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const timer = setInterval(() => {
          const scrollHeight = document.documentElement.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, interval);
      });
    },
    { interval: SCROLL_INTERVAL, distance: SCROLL_DISTANCE }
  );
  
  // Return to top and wait for layout to stabilize
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
}

// Main image checking function
async function checkImages(page: Page, context = '', options: ImageCheckOptions = {}) {
  const failedRequests = new Map();
  const responseStatuses = new Map();

  // Set up request tracking
  page.on('requestfailed', request => {
    failedRequests.set(request.url(), {
      error: request.failure()?.errorText || 'Unknown error',
      resourceType: request.resourceType()
    });
  });

  page.on('response', response => {
    if (response.request().resourceType() === 'image') {
      responseStatuses.set(response.url(), {
        status: response.status(),
        statusText: response.statusText()
      });
    }
  });

  // Wait for network to settle and scroll page
  await Promise.all([
    page.waitForLoadState('networkidle', { timeout: NETWORK_IDLE_TIMEOUT }),
    autoScroll(page)
  ]);

  // Get all images
  const images = page.getByRole('img');
  const count = await images.count();
  console.log(`\n=== Found ${count} images ${context} ===\n`);

  // Check each image
  for (let i = 0; i < count; i++) {
    const image = images.nth(i);
    const [src, alt, className] = await Promise.all([
      image.getAttribute('src'),
      image.getAttribute('alt'),
      image.getAttribute('class')
    ]);

    console.log(`\nChecking image ${i + 1}/${count}:
    src: ${src || 'NO SRC'}
    alt: ${alt || 'NO ALT'}
    class: ${className || 'NO CLASS'}`);

    if (shouldSkipImage(className, alt, src)) {
      console.log(`ℹ️ Skipping icon/decorative image check`);
      continue;
    }

    // Check for failed requests
    const failureInfo = failedRequests.get(src);
    if (failureInfo) {
      console.warn(`❌ Network request failed for ${src}:
      Error: ${failureInfo.error}
      Resource Type: ${failureInfo.resourceType}`);
    }

    // Determine image type and handling strategy
    const isSvg = src?.toLowerCase().endsWith('.svg');
    const isNextImage = src?.includes('/_next/image');
    const isAvatar = src?.includes('employee.webp');

    try {
      // Wait for image to be visible first
      await image.waitFor({ state: 'visible', timeout: IMAGE_CHECK_TIMEOUT });

      if (isSvg) {
        // For SVGs, just check visibility and basic dimensions
        const box = await image.boundingBox();
        if (!box || (box.width === 0 && box.height === 0)) {
          throw new Error('SVG has no dimensions');
        }
      } else {
        // For other images, check loading state
        const inViewport = await isInViewport(page, await image.elementHandle());
        
        if (!inViewport && await image.getAttribute('loading') === 'lazy') {
          console.log(`ℹ️ Skipping lazy-loaded image not in viewport: ${src}`);
          continue;
        }

        // Check image loading state
        const imageState = await getImageState(page, i);
        if (!imageState) {
          console.warn(`❌ Could not evaluate image state for ${src}`);
          continue;
        }

        // Skip detailed checks for certain cases
        if (isAvatar || (imageState.loading === 'lazy' && !imageState.isInViewport)) {
          console.log(`ℹ️ Skipping detailed checks for ${isAvatar ? 'avatar' : 'lazy-loaded'} image: ${src}`);
          continue;
        }

        // Verify dimensions
        expect(
          imageState.naturalWidth > 0 || imageState.offsetWidth > 0,
          `Image has no width: ${src}`
        ).toBeTruthy();

        expect(
          imageState.naturalHeight > 0 || imageState.offsetHeight > 0,
          `Image has no height: ${src}`
        ).toBeTruthy();

        // Verify loading completed
        expect(imageState.complete, `Image failed to load: ${src}`).toBeTruthy();
      }
    } catch (error: any) {
      console.warn(`⚠️ Image check failed for ${src}: ${error.message}`);
      if (!isAvatar) {
        throw error;
      }
    }
  }

  // Log summaries
  logRequestSummaries(failedRequests, responseStatuses);
}

// Helper to get image state
async function getImageState(page: Page, index: number): Promise<ImageLoadState | null> {
  return page.evaluate((idx) => {
    const img = document.querySelectorAll('img')[idx];
    if (!(img instanceof HTMLImageElement)) return null;

    const rect = img.getBoundingClientRect();
    return {
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      currentSrc: img.currentSrc,
      offsetWidth: img.offsetWidth,
      offsetHeight: img.offsetHeight,
      loading: img.loading,
      decoding: img.decoding,
      crossOrigin: img.crossOrigin,
      sizes: img.sizes,
      srcset: img.srcset,
      isInViewport: (
        rect.top >= -rect.height &&
        rect.left >= -rect.width &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + rect.height &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) + rect.width
      )
    };
  }, index);
}

// Helper to log request summaries
function logRequestSummaries(failedRequests: Map<string, any>, responseStatuses: Map<string, any>) {
  if (failedRequests.size > 0) {
    console.log('\n=== Failed Image Requests ===');
    for (const [url, info] of failedRequests) {
      console.log(`❌ ${url}:\n  Error: ${info.error}\n  Type: ${info.resourceType}`);
    }
  }

  console.log('\n=== Image Response Statuses ===');
  for (const [url, info] of responseStatuses) {
    console.log(`${info.status === 200 ? '✅' : '❌'} ${url}:\n  Status: ${info.status}\n  Status Text: ${info.statusText}`);
  }
}

test.describe('Product Pages', () => {
  test.describe('Docker Extension Page', () => {
    test('should render correctly', async ({ page }) => {
      await page.goto('/product/docker-extension');
      
      // Check main heading
      await expect(page.getByRole('heading', { name: /Release Share Docker Extension/i }))
        .toBeVisible();
      
      // Check CTA button
      const ctaButton = page.getByRole('link', { name: /Try Release Share/i });
      await expect(ctaButton).toBeVisible();
      await expect(ctaButton).toHaveAttribute(
        'href',
        'https://hub.docker.com/extensions/releasecom/docker-extension'
      );
      
      // Check feature sections
      await expect(page.getByText(/Instant Sharing/i)).toBeVisible();
      await expect(page.getByText(/Instant Collaboration/i)).toBeVisible();
      await expect(page.getByText(/Right in your workflow/i)).toBeVisible();
      
      // Check 'How to get started' section
      await expect(page.getByRole('heading', { name: /How to get started/i }))
        .toBeVisible();
      await expect(page.getByText(/Start your Docker Desktop/i)).toBeVisible();
      await expect(page.getByRole('heading', { name: /Install Release Share/i }))
        .toBeVisible();
      await expect(page.getByText(/Share containers/i)).toBeVisible();

      // Check all images
      await checkImages(page, 'on Docker Extension page');
    });
  });

  test.describe('Instant Datasets Page', () => {
    test('should render correctly', async ({ page }) => {
      await page.goto('/product/instant-datasets');
      
      // Check main heading
      await expect(page.getByRole('heading', { name: /Release Instant Datasets/i }))
        .toBeVisible();
      
      // Check CTA buttons
      const ctaButtons = page.getByRole('link', { name: /Try Instant Datasets Free/i });
      await expect(ctaButtons.first()).toBeVisible();
      await expect(ctaButtons.first()).toHaveAttribute(
        'href',
        /^https:\/\/web\.release\.com\/instantdatasets\/register/
      );
      
      // Check features
      const features = [
        'Clone production and other data',
        'Test code against real-world scenarios',
        'Protect sensitive data',
        'Reduce storage costs',
        'Automate your data replication workflows',
      ];
      
      for (const feature of features) {
        await expect(page.getByText(new RegExp(feature, 'i'))).toBeVisible();
      }
      
      // Check steps section
      await expect(page.getByRole('heading', { name: /Production-like data in 3 steps/i }))
        .toBeVisible();
      await expect(page.getByText(/Connect your cloud account/i)).toBeVisible();
      await expect(page.getByText(/Create your dataset pool/i)).toBeVisible();
      await expect(page.getByText(/Build and test with your data/i)).toBeVisible();
      
      // Check database support section
      await expect(page.getByRole('heading', {
        name: /Works with your databases and cloud platforms/i,
      })).toBeVisible();

      // Check all images
      await checkImages(page, 'on Instant Datasets page');
    });

    test('should be responsive', async ({ page }) => {
      await page.goto('/product/instant-datasets');
      
      const viewports = [
        { width: 375, height: 667, name: 'mobile' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 1440, height: 900, name: 'desktop' }
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await checkImages(page, `on ${viewport.name} viewport`);
      }
    });
  });
});
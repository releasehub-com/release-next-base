import { test, expect } from '@playwright/test';

async function checkImages(page, context = '') {
  // Track failed requests
  const failedRequests = new Map();
  page.on('requestfailed', request => {
    failedRequests.set(request.url(), {
      error: request.failure()?.errorText || 'Unknown error',
      resourceType: request.resourceType()
    });
  });

  // Track response statuses
  const responseStatuses = new Map();
  page.on('response', response => {
    if (response.request().resourceType() === 'image') {
      responseStatuses.set(response.url(), {
        status: response.status(),
        statusText: response.statusText()
      });
    }
  });

  // Wait for network requests to settle
  await page.waitForLoadState('networkidle');
  
  const images = page.getByRole('img');
  const count = await images.count();
  console.log(`\n=== Found ${count} images ${context} ===\n`);
  
  for (let i = 0; i < count; i++) {
    const image = images.nth(i);
    const src = await image.getAttribute('src');
    const alt = await image.getAttribute('alt');
    const role = await image.getAttribute('role');
    const className = await image.getAttribute('class');
    
    console.log(`\nChecking image ${i + 1}/${count}:
    src: ${src || 'NO SRC'}
    alt: ${alt || 'NO ALT'}
    role: ${role || 'NO ROLE'}
    class: ${className || 'NO CLASS'}`);

    // Skip Lucide icons as they're rendered as SVGs by the component
    if (className?.includes('lucide')) {
      console.log(`ℹ️ Skipping Lucide icon check`);
      continue;
    }
    
    if (!src) {
      console.log(`❌ Image ${i + 1} has no src attribute ${context}`);
      continue;
    }

    // Check if this image had any failed requests
    const failureInfo = failedRequests.get(src);
    if (failureInfo) {
      console.log(`❌ Network request failed for ${src}:
      Error: ${failureInfo.error}
      Resource Type: ${failureInfo.resourceType}`);
    }

    // Check response status
    const responseInfo = responseStatuses.get(src);
    if (responseInfo) {
      console.log(`Response status for ${src}:
      Status: ${responseInfo.status}
      Status Text: ${responseInfo.statusText}`);
    }

    // Wait for the image to load with increased timeout
    try {
      await page.waitForFunction(
        ([selector, index]) => {
          const img = document.querySelectorAll(selector)[index];
          return img && img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0;
        },
        ['img', i],
        { timeout: 10000 }
      );
    } catch (error: any) {
      console.log(`⚠️ Image load timeout for ${src} (${alt}) ${context}
      Error: ${error?.message || 'Unknown error'}`);
    }
    
    // Verify image properties
    const imageLoadState = await image.evaluate((img) => {
      if (img instanceof HTMLImageElement) {
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
          srcset: img.srcset
        };
      }
      return null;
    });
    
    if (!imageLoadState) {
      console.log(`❌ Could not evaluate image state for ${src} (${alt}) ${context}`);
      continue;
    }

    const details = `
      complete: ${imageLoadState.complete}
      naturalWidth: ${imageLoadState.naturalWidth}
      naturalHeight: ${imageLoadState.naturalHeight}
      currentSrc: ${imageLoadState.currentSrc}
      offsetWidth: ${imageLoadState.offsetWidth}
      offsetHeight: ${imageLoadState.offsetHeight}
      loading: ${imageLoadState.loading}
      decoding: ${imageLoadState.decoding}
      crossOrigin: ${imageLoadState.crossOrigin}
      sizes: ${imageLoadState.sizes}
      srcset: ${imageLoadState.srcset}
    `;

    if (!imageLoadState.complete || !imageLoadState.naturalWidth || !imageLoadState.naturalHeight) {
      console.log(`❌ Image failed checks:${details}`);
    } else {
      console.log(`✅ Image loaded successfully:${details}`);
    }

    expect(imageLoadState.complete, 
      `Image failed to load: ${src} (${alt}) ${context}\nDetails:${details}`
    ).toBeTruthy();
    
    expect(imageLoadState.naturalWidth,
      `Image has no width: ${src} (${alt}) ${context}\nDetails:${details}`
    ).toBeGreaterThan(0);
    
    expect(imageLoadState.naturalHeight,
      `Image has no height: ${src} (${alt}) ${context}\nDetails:${details}`
    ).toBeGreaterThan(0);
  }

  // Summary of failed requests
  if (failedRequests.size > 0) {
    console.log('\n=== Failed Image Requests ===');
    for (const [url, info] of failedRequests) {
      console.log(`❌ ${url}:
      Error: ${info.error}
      Type: ${info.resourceType}`);
    }
  }

  // Summary of response statuses
  console.log('\n=== Image Response Statuses ===');
  for (const [url, info] of responseStatuses) {
    console.log(`${info.status === 200 ? '✅' : '❌'} ${url}:
    Status: ${info.status}
    Status Text: ${info.statusText}`);
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
        'https://web.release.com/instantdatasets/register'
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
# Landing Pages & Signup Versions

This document explains how to add or modify landing pages and their corresponding signup page versions.

## Overview

All version configuration is centralized in `config/versions.ts`. Each version defines:
- Its landing page path
- Any version aliases
- The content shown on the signup page

## Adding a New Version

### 1. Add Version Configuration

Add your version to the `VERSIONS` object in `config/versions.ts`:

    'your-version': {
      id: 'your-version',
      aliases: ['alias1', 'alias2'],  // Optional aliases
      path: '/your-landing-page',     // URL path for the landing page
      content: {
        title: "Your Landing Page Title",
        benefits: [
          {
            icon: "icon-name",        // Must match an icon in BenefitIcons
            title: "Benefit Title",
            description: "Benefit description"
          },
          // Add 2 more benefits (exactly 3 required)
        ],
        steps: [
          "Step 1",
          "Step 2",
          "Step 3"
        ]
      }
    }

### 2. Create Landing Page

Create a new file at `app/your-landing-page/page.tsx`:

    "use client";

    import dynamic from "next/dynamic";
    import LandingPageWrapper from "@/components/LandingPageWrapper";

    const YourLandingPage = dynamic(
      () => import("@/components/YourLandingPage").then((mod) => mod.default),
      { ssr: false },
    );

    export default function YourLandingPagePage() {
      return (
        <LandingPageWrapper>
          <YourLandingPage />
        </LandingPageWrapper>
      );
    }

## Version Requirements

Each version must include:

### Required Fields
- `id`: Unique identifier for the version
- `path`: URL path for the landing page
- `content`: 
  - `title`: Main heading
  - `benefits`: Exactly 3 benefits
  - `steps`: Exactly 3 steps

### Optional Fields
- `aliases`: Alternative version names

## URL Patterns

- Landing Page: `/{path}`
- Version Parameter: `/?version={id}`
- Signup with Version: `/signup?version={id}`

## Testing Your Version

1. Direct Access:
   - Visit landing page: `/your-landing-page`
   - Check signup page: `/signup?version=your-version`

2. Version Parameters:
   - Root with version: `/?version=your-version`
   - Root with alias: `/?version=alias1`

3. Version Persistence:
   - Navigate between pages
   - Check localStorage: `landing_version`

## Common Tasks

### Adding Icons
1. Open `app/signup/components/BenefitIcons.tsx`
2. Add your icon to the `icons` object
3. Use the icon name in your version's benefits

### Updating Content
1. Find your version in `config/versions.ts`
2. Update the `content` object
3. Changes will reflect immediately on the signup page

## Troubleshooting

### Version Not Showing
- Check version ID matches exactly
- Verify path is correct
- Check localStorage for persisted version

### Content Not Updating
- Clear localStorage
- Verify content structure matches interface
- Check for console errors

## Best Practices

1. Keep benefits concise and focused
2. Use clear, action-oriented steps
3. Test all paths and aliases
4. Use semantic icons that match content
5. Maintain consistent tone across versions

## Testing Guide

### Running Tests

Run version-related tests using:

    pnpm test versions
    pnpm test:watch versions
    pnpm test __tests__/config/versions.test.ts

### Test Structure

Tests are located in `__tests__/config/versions.test.ts` and cover:

1. Version Validation
   - Tests canonical versions
   - Tests version aliases
   - Handles invalid versions

2. Path Mapping
   - Tests URL to version mapping
   - Tests version to URL mapping
   - Handles root path ('/')

3. Content Structure
   - Validates required fields
   - Checks benefit structure
   - Verifies step content

4. Storage Management
   - Tests localStorage
   - Tests cookie fallback
   - Handles invalid values

### Adding Tests for New Versions

When adding a new version, add tests for:

1. Version Validation:
   - Test your version ID
   - Test any aliases
   - Test invalid cases

2. Path Resolution:
   - Test path → version
   - Test version → path
   - Test fallbacks

3. Content Structure:
   - Test title
   - Test benefits (3 required)
   - Test steps (3 required)

### Example Test Cases

    describe('Your Version', () => {
      it('validates version', () => {
        expect(isValidVersion('your-version')).toBe(true)
      })

      it('maps paths', () => {
        expect(getVersionPath('your-version')).toBe('/your-path')
      })

      it('provides content', () => {
        const content = getVersionContent('your-version')
        expect(content.title).toBeDefined()
      })
    })

### Test Cleanup

Tests automatically:
- Clear localStorage
- Reset cookies
- Reset document state

This is handled in the beforeEach hook:

    beforeEach(() => {
      localStorage.clear()
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.split('=')
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`
      })
    })

### Common Test Issues

1. Storage Problems
   - Clear storage before tests
   - Reset cookies properly
   - Check for state leaks

2. Path Resolution
   - Test root path specially
   - Handle unknown paths
   - Check defaults

3. Content Validation
   - Check all fields exist
   - Verify array lengths
   - Validate icons

## Using AI to Add Versions

### AI Prompt Template

When using AI to help create a new version, use this prompt structure:

    I need to add a new version to our landing pages system. Here are the details:

    1. Version Name: [your-version]
    2. URL Path: /[desired-path]
    3. Aliases (if any): [alias1, alias2]
    4. Target Audience: [describe who this is for]
    5. Key Value Proposition: [main benefit/feature]
    6. Unique Differentiators: [what makes this special]

    The version needs:
    - 3 benefits with icons (using existing icons: git, scale, cloud-provider, automation, kubernetes, gitlab, pipeline, collaboration, performance, security)
    - 3 clear steps for getting started
    - A concise title

    Please provide:
    1. The version configuration for config/versions.ts
    2. The landing page component code
    3. Test cases for this version

### Example AI Prompt

Here's a real example:

    I need to add a new version to our landing pages system. Here are the details:

    1. Version Name: cloud-dev
    2. URL Path: /cloud-development-environments
    3. Aliases: none
    4. Target Audience: Development teams needing cloud-based development environments
    5. Key Value Proposition: Instant, powerful cloud development environments
    6. Unique Differentiators: 
       - No local setup required
       - Full cloud resources
       - Team collaboration features

    The version needs:
    - 3 benefits with icons (using existing icons: git, scale, cloud-provider, automation, kubernetes, gitlab, pipeline, collaboration, performance, security)
    - 3 clear steps for getting started
    - A concise title

    Please provide:
    1. The version configuration for config/versions.ts
    2. The landing page component code
    3. Test cases for this version

### AI Response Checklist

Verify the AI's response includes:

1. Version Configuration:
   - Correct type structure
   - All required fields
   - Appropriate icons
   - Clear benefits and steps

2. Landing Page:
   - Proper imports
   - LandingPageWrapper usage
   - Dynamic imports

3. Tests:
   - Version validation
   - Path mapping
   - Content structure

### Post-AI Tasks

After getting AI output:

1. Review and adjust content for brand voice
2. Verify icon selections are appropriate
3. Test all paths and aliases
4. Check content formatting
5. Run the test suite

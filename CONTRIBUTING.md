# Contributing to the Release Blog

Welcome to the Release blog! We're excited to have you contribute. This guide will help you understand our blog post creation process and requirements.

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/releasehub/release-landing-new.git
   cd release-landing-new
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a new branch for your blog post:
   ```bash
   git checkout -b blog/your-post-name
   ```
4. Write your blog post content in `app/blog/posts/your-post-title.mdx` (without frontmatter)
5. Process your blog post to generate frontmatter and check spelling:
   ```bash
   # First, preview the generated frontmatter
   pnpm process-blog:dry-run app/blog/posts/your-post-title.mdx

   # If the output looks good, apply the changes
   pnpm process-blog app/blog/posts/your-post-title.mdx
   ```
6. Make any necessary adjustments to the generated frontmatter
7. Validate your blog post before submitting:
   ```bash
   pnpm validate-blog app/blog/posts/your-post-title.mdx
   ```
8. Fix any validation issues
9. Submit a pull request

## Blog Post Processing

Our blog post workflow is split into two parts:

### 1. Content Processing and Generation
The `process-blog` command helps you create your post by:

- **Generating SEO-Optimized Frontmatter**: Uses AI to analyze your content and generate:
  - Title (if not already in the content)
  - Summary (2 sentences max)
  - Excerpt for social media
  - Categories and tags
  - Image alt text
  
- **Automatic Calculations**:
  - Reading time (based on word count)
  - Publication date (current date)
  
- **Smart Related Posts**:
  - Automatically selects 3 most relevant existing blog posts
  - Uses AI to analyze content similarity
  
- **Default Values**:
  - Standard CTA configuration
  - Proper UTM parameters
  
- **Spell Checking**:
  - Identifies possible spelling errors
  - Suggests corrections

### 2. Pre-Publication Validation
The `validate-blog` command performs comprehensive checks:

- **Content Quality**:
  - Minimum word count (300 words)
  - Proper frontmatter structure
  - Required fields presence
  - Spell checking with smart filtering:
    - Ignores code blocks and inline code
    - Skips technical terms and proper nouns
    - Excludes image hashes and hex strings
    - Ignores URLs and file paths
    - Shows spelling suggestions as warnings
  
- **Author Validation**:
  - Author must exist in `app/blog/lib/authors.ts`
  - Special case: 'default' author is used as fallback
  
- **Image Validation**:
  - File existence in `/public/blog-images` directory
  - Recommended dimensions (1200x630px)
    - Main blog image
    - OG image (if different from main image)
    - Content images
  - File size (max 500KB)
  - Format (JPEG/PNG)
  
- **Link Validation**:
  - Proper UTM parameters
  - Valid CTA configuration
  
- **Related Content**:
  - Exactly 3 related posts required
  - All related posts must exist in the blog directory
  
- **Metadata Validation**:
  - Categories and tags presence
  - Summary length (max 2 sentences)
  - Required fields completeness

### Environment Setup

The blog processing tools use OpenAI's API for several features:
- Generating SEO-optimized frontmatter
- Finding related posts
- Creating engaging excerpts and summaries

To use these features, create a `.env.blog` file in the root directory with your OpenAI API key:
```bash
OPENAI_API_KEY="your-openai-api-key"
```

This separate environment file prevents conflicts with the main application's environment variables. You can get an API key from [OpenAI's platform](https://platform.openai.com/api-keys).

Note: The `validate-blog` command for checking spelling, images, and other requirements does not require an API key.

### Image Guidelines

1. Add your blog post image to `/public/blog-images/` before running the processor
2. Image requirements (automatically validated):
   - Format: JPEG or PNG
   - Size: Under 500KB
   - Dimensions: 1200x630px
   - Name: Use descriptive, kebab-case names

### Common Validation Issues and Solutions

1. **Spelling Issues**:
   - Review spelling warnings in content
   - Technical terms are automatically ignored, including:
     - Programming languages and tools
     - Cloud and infrastructure terms
     - Common technical abbreviations
     - File extensions and formats
   - The following are automatically excluded from spell check:
     - Code blocks and inline code
     - URLs and file paths
     - Image hashes and hex strings
     - Proper nouns (capitalized words)
     - Numbers and numeric strings
   - Consider adding missing technical terms to the dictionary if needed

2. **Author Issues**:
   - Ensure author is specified in frontmatter
   - Author must be defined in `app/blog/lib/authors.ts`
   - Each author entry requires:
     - name: Full name
     - image: Author's profile image
     - Optional: title, twitter, linkedin
   - Use 'default' if no specific author is assigned

3. **Image Issues**:
   - Ensure all images exist in `/public/blog-images/`
   - Main image and content images should be 1200x630px
   - Use image optimization tools to meet size requirements (max 500KB)
   - Convert to JPEG/PNG if using other formats
   - Warning: Content images with incorrect dimensions will be flagged

4. **Content Issues**:
   - Ensure minimum 300-word length
   - Break long summaries into shorter sentences
   - Add missing categories or tags
   - Categories must be lowercase and use dashes instead of spaces

5. **Related Posts**:
   - Exactly 3 related posts required
   - All related post slugs must match existing blog posts
   - Wait for AI to suggest related posts
   - Manually verify suggestions are relevant

6. **UTM Parameters**:
   - Don't modify the auto-generated UTM structure
   - Ensure slug matches the filename
   - Keep the standard UTM parameter format

## Blog Post Structure

### File Location and Naming
- All blog posts should be placed in the `app/blog/posts/` directory
- Use kebab-case for file names: `your-blog-post-title.mdx`
- File extension must be `.mdx`

### Required Frontmatter
Every blog post needs the following frontmatter at the top of the file:

```yaml
---
title: "Your Blog Post Title"
summary: "A compelling 1-2 sentence summary of your post"
publishDate: "YYYY-MM-DD"
author: "author-id"  # Must match an entry in app/blog/lib/authors.ts
readingTime: 5
categories: 
  - platform-engineering
  - product
mainImage: "/blog-images/your-image-name.jpg"
imageAlt: "Descriptive alt text for your main image"
showCTA: true
ctaCopy: "Call to action text for the bottom of your post"
ctaLink: "https://release.com/signup?utm_source=blog"
relatedPosts:
  - "slug-of-related-post-1"
  - "slug-of-related-post-2"
ogImage: "/blog-images/your-image-name.jpg"
excerpt: "A brief excerpt for social media and previews"
tags:
  - platform-engineering
  - product
ctaButton: "Try Release for Free"
---
```

### Images
- Place all blog images in the `/blog-images/` directory
- Use optimized images (JPEG/PNG) under 500KB
- Recommended main image dimensions: 1200x630px
- Include meaningful alt text for all images

## Writing Guidelines

### Content Structure
1. Start with a clear introduction
2. Use proper heading hierarchy (H2, H3, H4)
3. Include code examples where relevant
4. End with a clear conclusion or call to action

### Markdown Features
- Use standard markdown syntax
- MDX supports React components
- Code blocks should specify language:
  ```javascript
  const example = "code here";
  ```

### Style Guidelines
- Use clear, concise language
- Break up long paragraphs
- Use bullet points and lists for better readability
- Include relevant links and references
- Proofread for spelling and grammar

## Local Development

To preview your blog post locally:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. View your post at `http://localhost:3000/blog/[your-post-slug]`

## Submission Process

1. Create a new branch:
   ```bash
   git checkout -b blog/your-post-name
   ```

2. Add and commit your changes:
   ```bash
   git add .
   git commit -m "Add blog post: Your Post Title"
   ```

3. Push to your fork and create a pull request

4. Wait for review and address any feedback

## Need Help?

- For technical issues, create a GitHub issue
- For content questions, reach out to the blog team
- For urgent matters, contact [appropriate contact method]

## Categories and Tags

Common categories include:
- platform-engineering
- product
- engineering
- tutorials
- case-studies

Choose relevant categories and tags that best describe your content.

## Code of Conduct

Please ensure your content:
- Is original and not published elsewhere
- Respects intellectual property rights
- Follows our inclusive language guidelines
- Maintains a professional tone

Thank you for contributing to the Release blog! We look forward to your submissions. 
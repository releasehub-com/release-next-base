(() => {
  require('dotenv').config();
  const fs = require('fs');
  const path = require('path');
  const { OpenAI } = require('openai');
  const { Command } = require('commander');
  const yaml = require('js-yaml');
  const glob = require('glob');

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const program = new Command();

  interface BlogFrontmatter {
    title: string;
    summary: string;
    publishDate: string;
    author: string;
    readingTime: number;
    categories: string[];
    mainImage: string;
    imageAlt: string;
    showCTA: boolean;
    ctaCopy: string;
    ctaLink: string;
    relatedPosts: string[];
    ogImage: string;
    excerpt: string;
    tags: string[];
    ctaButton: string;
  }

  function getAllBlogPosts(): { title: string; slug: string; content: string }[] {
    const blogDir = path.join(process.cwd(), 'app/blog/posts');
    const blogFiles = glob.sync('*.mdx', { cwd: blogDir });
    
    return blogFiles.map(file => {
      const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
      let title = '';
      let mainContent = content;

      // Try to extract frontmatter if it exists
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (frontmatterMatch) {
        try {
          const frontmatter = yaml.load(frontmatterMatch[1]) as Partial<BlogFrontmatter>;
          title = frontmatter.title || '';
          mainContent = content.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
        } catch (error) {
          // If YAML parsing fails, treat it as content without frontmatter
          console.log(`Warning: Invalid frontmatter in ${file}, treating as content`);
        }
      }

      // If no title from frontmatter, try to get it from the first heading
      if (!title) {
        const titleMatch = mainContent.match(/^#\s+(.+)$/m);
        if (titleMatch) {
          title = titleMatch[1];
        }
      }
      
      return {
        title,
        slug: file.replace('.mdx', ''),
        content: mainContent
      };
    });
  }

  async function getRelatedPosts(content: string, currentSlug: string): Promise<string[]> {
    const existingPosts = getAllBlogPosts();
    
    // Get first 1000 chars of content and first 200 chars of each post
    const truncatedContent = content.substring(0, 1000);
    const truncatedPosts = existingPosts.map(post => ({
      title: post.title,
      slug: post.slug,
      content: post.content.substring(0, 200)
    }));
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert at finding related content. Given a blog post and a list of other posts, select the 3 most relevant related posts. Return ONLY the slugs, one per line, without numbers or backticks."
        },
        {
          role: "user",
          content: `Select the 3 most relevant related posts for this content:
          Current post excerpt: ${truncatedContent}
          
          Available posts:
          ${truncatedPosts.map(post => `Title: ${post.title}\nSlug: ${post.slug}\nExcerpt: ${post.content}\n`).join('\n')}
          `
        }
      ]
    });

    try {
      const responseText = completion.choices[0].message.content || '';
      // First try parsing as JSON
      try {
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const relatedSlugs = JSON.parse(jsonMatch[0]);
          return relatedSlugs.slice(0, 3);
        }
      } catch (e) {
        // Ignore JSON parse error and try text format
      }

      // If not JSON, try parsing as text list
      const slugs = responseText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => line
          .replace(/^\d+\.\s*/, '') // Remove leading numbers
          .replace(/^[`']|[`']$/g, '') // Remove backticks/quotes
        )
        .filter(slug => slug.length > 0)
        .slice(0, 3);

      return slugs;
    } catch (error) {
      console.error('Error parsing related posts response:', error);
      console.error('Raw response:', completion.choices[0].message.content);
      return []; // Return empty array on error
    }
  }

  function validateImage(imagePath: string): boolean {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    return fs.existsSync(fullPath);
  }

  function generateUtmLink(slug: string): string {
    return `https://release.com/signup?utm_source=blog&utm_medium=cta&utm_campaign=blog-cta&utm_content=${slug}`;
  }

  function countSentences(text: string): number {
    // Split on period followed by space or end of string
    // Account for common abbreviations like "e.g.", "i.e.", "etc."
    const cleaned = text
      .replace(/e\.g\./g, 'eg')
      .replace(/i\.e\./g, 'ie')
      .replace(/etc\./g, 'etc')
      .replace(/\.\.\./g, '…'); // Replace ellipsis with single character
      
    return (cleaned.match(/[.!?]+(?:\s+|$)/g) || []).length;
  }

  function formatCategory(category: string): string {
    // Convert to lowercase and replace spaces with dashes
    return category.toLowerCase().replace(/\s+/g, '-');
  }

  async function generateFrontmatter(content: string, filePath: string, author?: string): Promise<BlogFrontmatter> {
    // Extract the actual content, skipping any markdown headers
    const contentWithoutHeaders = content.replace(/^#[^\n]*\n/, '').trim();
    
    // Get first 2000 chars for content analysis, but make sure we get complete sentences
    let truncatedContent = contentWithoutHeaders.substring(0, 2000);
    const lastPeriod = truncatedContent.lastIndexOf('.');
    if (lastPeriod > 0) {
      truncatedContent = truncatedContent.substring(0, lastPeriod + 1);
    }
    
    let aiResponse;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-0125-preview",
        messages: [
          {
            role: "system",
            content: "You are an SEO expert that generates blog post metadata. Generate engaging, SEO-optimized metadata for the blog post content provided. The summary MUST be exactly 1-2 sentences long - no more, no less. Return ONLY a JSON object with the following fields: title, summary (1-2 sentences max), excerpt (for social/preview), categories (list), and imageAlt. Categories should be lowercase with dashes instead of spaces (e.g. 'platform-engineering' not 'Platform Engineering')."
          },
          {
            role: "user",
            content: `Generate frontmatter for this blog post. Here's the beginning of the content: ${truncatedContent}...`
          }
        ]
      });

      try {
        const responseText = completion.choices[0].message.content || '{}';
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No valid JSON object found in response');
        }
        aiResponse = JSON.parse(jsonMatch[0]);
        
        // Format categories to be lowercase with dashes
        if (aiResponse.categories) {
          aiResponse.categories = aiResponse.categories.map(formatCategory);
        }
        
        // Validate sentence count
        const sentenceCount = countSentences(aiResponse.summary);
        if (sentenceCount > 2) {
          console.log(`Generated summary has ${sentenceCount} sentences. Retrying...`);
          attempts++;
          continue;
        }
        
        break;
      } catch (error) {
        console.error('Error parsing OpenAI response:', error);
        console.error('Raw response:', completion.choices[0].message.content);
        attempts++;
        if (attempts === maxAttempts) {
          throw error;
        }
      }
    }

    if (!aiResponse) {
      throw new Error('Failed to generate valid frontmatter after maximum attempts');
    }

    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Get the slug from the file path
    const slug = path.basename(filePath, '.mdx');

    // Get related posts
    const relatedPosts = await getRelatedPosts(content, slug);

    // Generate the frontmatter
    const frontmatter: BlogFrontmatter = {
      ...aiResponse,
      publishDate: new Date().toISOString(),
      author: author || '', // Leave blank if no author provided
      readingTime,
      categories: aiResponse.categories,
      mainImage: '/blog-images/placeholder.jpg',
      showCTA: true,
      ctaCopy: "Try Release today to streamline your development workflow.",
      ctaLink: generateUtmLink(slug),
      relatedPosts,
      ogImage: '/blog-images/placeholder.jpg',
      tags: aiResponse.categories, // This will be replaced with a YAML alias in the dump
      ctaButton: "Try Release for Free"
    };

    // Validate images
    if (!validateImage(frontmatter.mainImage)) {
      console.warn(`Warning: Image ${frontmatter.mainImage} does not exist in the public directory`);
    }

    return frontmatter;
  }

  async function processBlogPost(filePath: string, options: { dryRun?: boolean; author?: string } = {}) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check if frontmatter already exists by looking for the frontmatter delimiters
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    let existingContent = content;
    
    if (frontmatterMatch) {
      try {
        const frontmatter = yaml.load(frontmatterMatch[1]) as Partial<BlogFrontmatter>;
        // Only consider it frontmatter if it has typical frontmatter fields
        if (frontmatter && (
          frontmatter.title ||
          frontmatter.summary ||
          frontmatter.publishDate ||
          frontmatter.author
        )) {
          console.log('Frontmatter already exists. Skipping processing.');
          return;
        }
      } catch (error) {
        // If YAML parsing fails, treat it as content without frontmatter
        console.log('Invalid frontmatter found, treating as content without frontmatter');
      }
    }

    // Strip any invalid frontmatter-like sections from the beginning
    existingContent = existingContent.replace(/^---\n[\s\S]*?\n---\n/, '');

    // Generate frontmatter
    const frontmatter = await generateFrontmatter(existingContent, filePath, options.author);
    
    // Convert to YAML with anchor and alias
    let frontmatterYaml = yaml.dump(frontmatter);
    
    // Replace categories and tags with anchor/alias format
    const categoriesMatch = frontmatterYaml.match(/categories:\n((?:  - .*\n)*)/);
    if (categoriesMatch) {
      const categoriesBlock = categoriesMatch[0];
      const tagsBlock = frontmatterYaml.match(/tags:(?:\n(?:  - .*)*)/)?.[0] || 'tags: []';
      
      // Replace categories with anchor and tags with alias
      frontmatterYaml = frontmatterYaml
        .replace(categoriesBlock, `categories: &ref_0\n${categoriesMatch[1]}`)
        .replace(tagsBlock, 'tags: *ref_0');
    }
    
    const newContent = `---\n${frontmatterYaml}---\n\n${existingContent.trim()}`;
    
    if (options.dryRun) {
      console.log('Generated frontmatter:');
      console.log(frontmatterYaml);
    } else {
      fs.writeFileSync(filePath, newContent);
      console.log('Successfully updated blog post with frontmatter!');
    }
  }

  program
    .argument('<file>', 'Blog post file to process')
    .option('--dry-run', 'Show generated frontmatter without updating file')
    .option('--author <author>', 'Specify the author of the blog post')
    .action(async (file, options) => {
      try {
        await processBlogPost(file, {
          dryRun: options.dryRun,
          author: options.author
        });
      } catch (error) {
        console.error('Error processing blog post:', error);
        process.exit(1);
      }
    });

  program.parse();
})(); 
(() => {
  require('dotenv').config();
  const fs = require('fs');
  const path = require('path');
  const yaml = require('js-yaml');
  const { program } = require('commander');
  const sharp = require('sharp');
  const Dictionary = require('simple-spellchecker');

  // Technical dictionary words
  const technicalWords = new Set([
    'kubernetes', 'k8s', 'kubectl', 'nginx', 'api', 'yaml', 'json', 'github',
    'devops', 'ci', 'cd', 'saas', 'paas', 'iaas', 'aws', 'gcp', 'azure',
    'docker', 'containerization', 'microservices', 'scalability', 'autoscaling',
    'frontend', 'backend', 'fullstack', 'javascript', 'typescript', 'python',
    'golang', 'java', 'scala', 'ruby', 'php', 'css', 'html', 'react', 'vue',
    'angular', 'node', 'npm', 'yarn', 'pnpm', 'webpack', 'babel', 'eslint',
    'postgres', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'kafka', 'rabbitmq',
    'prometheus', 'grafana', 'jenkins', 'gitlab', 'bitbucket', 'jira', 'slack',
    'api', 'rest', 'graphql', 'grpc', 'websocket', 'http', 'https', 'ssl', 'tls',
    'dns', 'cdn', 'ip', 'tcp', 'udp', 'oauth', 'jwt', 'saml', 'oidc',
    'release', 'deployment', 'rollback', 'backup', 'restore', 'monitoring',
    'logging', 'tracing', 'debugging', 'testing', 'production', 'staging',
    'development', 'qa', 'uat', 'sandbox', 'localhost', 'domain', 'subdomain',
    'url', 'uri', 'endpoint', 'middleware', 'plugin', 'addon', 'extension',
    'config', 'configuration', 'env', 'environment', 'variable', 'parameter',
    'argument', 'function', 'method', 'class', 'object', 'array', 'string',
    'number', 'boolean', 'null', 'undefined', 'async', 'await', 'promise',
    'callback', 'event', 'listener', 'emitter', 'observable', 'subscription',
    'markdown', 'mdx', 'frontmatter', 'blog', 'post', 'article', 'tutorial',
    'guide', 'documentation', 'readme', 'changelog', 'license', 'contributing',
    'roadmap', 'backlog', 'sprint', 'milestone', 'issue', 'bug', 'feature',
    'enhancement', 'improvement', 'optimization', 'refactoring', 'cleanup',
    // File extensions
    'png', 'jpg', 'jpeg', 'mdx', 'md', 'txt', 'js', 'ts', 'jsx', 'tsx',
    // Common contractions that might be flagged
    'isn', 'aren', 'wasn', 'weren', 'hasn', 'haven', 'hadn', 'don', 'doesn', 'didn', 'won', 'wouldn', 'shouldn', 'couldn',
    // Technical terms
    'autoscale', 'autoscaler', 'autoscaling', 'frontmatter', 'middleware', 'runtime', 'namespace',
    'microservice', 'microservices', 'serverless', 'stateful', 'stateless', 'webhook', 'webhooks',
    // Common abbreviations
    'dev', 'prod', 'qa', 'uat', 'api', 'cli', 'sdk', 'ui', 'ux', 'cdn', 'dns', 'tls', 'ssl',
    'tcp', 'udp', 'ip', 'http', 'https', 'url', 'uri', 'jwt', 'oauth', 'saml', 'oidc',
    // Cloud/infrastructure terms
    'podman', 'containerd', 'openshift', 'istio',
    // Development terms
    'devops', 'devsecops', 'gitops', 'cicd', 'repo', 'repos', 'codebase', 'changelog',
    'refactor', 'linter', 'linting', 'transpile', 'transpiling', 'minify',
    'minification', 'rollup', 'esbuild', 'vite', 'npm', 'yarn', 'pnpm',
    // Release-specific terms
    'releasehub', 'prerelease', 'prereleases', 'rollbacks', 'canary', 'canaries',
    'ephemeral', 'ephemerals',
    // Additional technical terms
    'devs', 'pre', 'timeline', 'app', 'apps', 'lifecycle', 'versioning'
  ]);

  let dictionary = null;

  function loadDictionary(): Promise<any> {
    return new Promise((resolve, reject) => {
      Dictionary.getDictionary('en-US', (err, dict) => {
        if (err) reject(err);
        else resolve(dict);
      });
    });
  }

  async function spellCheckContent(content: string): Promise<{ word: string; suggestions: string[] }[]> {
    if (!dictionary) {
      dictionary = await loadDictionary();
    }

    // First remove all code blocks (including their content)
    const contentWithoutCode = content.replace(/```[\s\S]*?```/g, '');
    
    // Remove inline code
    const contentWithoutInlineCode = contentWithoutCode.replace(/`[^`]*`/g, '');
    
    // Remove URLs
    const contentWithoutUrls = contentWithoutInlineCode.replace(/https?:\/\/[^\s]+/g, '');
    
    // Split into words
    const words = contentWithoutUrls.match(/\b\w+\b/g) || [];
    
    const misspellings: { word: string; suggestions: string[] }[] = [];
    const seenWords = new Set<string>();
    
    for (const word of words) {
      // Skip if we've already checked this word
      if (seenWords.has(word.toLowerCase())) continue;
      seenWords.add(word.toLowerCase());
      
      // Skip numbers
      if (/^\d+$/.test(word)) continue;
      
      // Skip words in technical dictionary
      if (technicalWords.has(word.toLowerCase())) continue;
      
      // Skip words that start with uppercase (likely proper nouns)
      if (word[0] === word[0].toUpperCase()) continue;

      // Skip long hex strings (like image hashes)
      if (/^[a-f0-9]{32,}$/i.test(word)) continue;
      
      // Check spelling
      if (!dictionary.spellCheck(word)) {
        const suggestions = dictionary.getSuggestions(word, 3);
        misspellings.push({ word, suggestions });
      }
    }
    
    return misspellings;
  }

  function loadAuthors(): Record<string, any> {
    const authorsPath = path.join(process.cwd(), 'app/blog/lib/authors.ts');
    const authorsContent = fs.readFileSync(authorsPath, 'utf-8');
    // Extract the authors object using regex
    const authorsMatch = authorsContent.match(/export const authors: Record<string, Author> = ({[\s\S]*?});/);
    if (!authorsMatch) {
      throw new Error('Could not parse authors from authors.ts');
    }
    // Evaluate the authors object
    const authorsObj = eval(`(${authorsMatch[1]})`);
    return authorsObj;
  }

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

  async function validateImage(imagePath: string, isMainImage: boolean = false): Promise<{ valid: boolean; issues: string[]; warnings: string[] }> {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    const issues: string[] = [];
    const warnings: string[] = [];

    if (!fs.existsSync(fullPath)) {
      return { valid: false, issues: [`Image ${imagePath} does not exist`], warnings: [] };
    }

    try {
      const metadata = await sharp(fullPath).metadata();
      const stats = fs.statSync(fullPath);
      const fileSizeInKB = stats.size / 1024;

      if (fileSizeInKB > 500) {
        if (isMainImage) {
          warnings.push(`Image size (${Math.round(fileSizeInKB)}KB) exceeds 500KB limit`);
        } else {
          issues.push(`Image size (${Math.round(fileSizeInKB)}KB) exceeds 500KB limit`);
        }
      }

      if (isMainImage && (metadata.width !== 1200 || metadata.height !== 630)) {
        warnings.push(`Image dimensions (${metadata.width}x${metadata.height}) differ from recommended 1200x630`);
      }

      if (!['jpeg', 'png'].includes(metadata.format || '')) {
        issues.push(`Image format (${metadata.format}) should be JPEG or PNG`);
      }

      return { valid: issues.length === 0, issues, warnings };
    } catch (error) {
      return { valid: false, issues: [`Error processing image: ${error.message}`], warnings: [] };
    }
  }

  function validateUtmParameters(ctaLink: string, slug: string): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    const url = new URL(ctaLink);
    const params = url.searchParams;

    const requiredUtm = {
      utm_source: 'blog',
      utm_medium: 'cta',
      utm_campaign: 'blog-cta',
      utm_content: slug
    };

    for (const [key, value] of Object.entries(requiredUtm)) {
      if (params.get(key) !== value) {
        issues.push(`Missing or incorrect ${key}=${value}`);
      }
    }

    return { valid: issues.length === 0, issues };
  }

  function validateRelatedPosts(relatedPosts: string[]): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    const blogDir = path.join(process.cwd(), 'app/blog/posts');

    if (relatedPosts.length !== 3) {
      issues.push(`Expected 3 related posts, found ${relatedPosts.length}`);
    }

    for (const slug of relatedPosts) {
      if (!slug) continue; // Skip empty slugs
      const postPath = path.join(blogDir, `${slug}.mdx`);
      if (!fs.existsSync(postPath)) {
        issues.push(`Related post "${slug}" does not exist`);
      }
    }

    return { valid: issues.length === 0, issues };
  }

  function validateFrontmatterFields(frontmatter: BlogFrontmatter): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    const requiredFields = Object.keys(frontmatter);
    const authors = loadAuthors();

    for (const field of requiredFields) {
      const value = frontmatter[field];
      if (value === undefined || value === null || value === '') {
        issues.push(`Missing or empty required field: ${field}`);
      }
    }

    // Validate author exists in authors.ts
    if (!authors[frontmatter.author] && frontmatter.author !== 'your-github-username') {
      issues.push(`Author "${frontmatter.author}" not found in authors.ts`);
    }

    // Validate specific fields
    if (frontmatter.summary.split('.').length > 2) {
      issues.push('Summary should be maximum 2 sentences');
    }

    if (frontmatter.categories.length === 0) {
      issues.push('At least one category is required');
    }

    // Validate category format
    frontmatter.categories.forEach(category => {
      if (category !== category.toLowerCase()) {
        issues.push(`Category "${category}" should be lowercase`);
      }
      if (category.includes(' ')) {
        issues.push(`Category "${category}" should use dashes instead of spaces`);
      }
    });

    if (frontmatter.tags.length === 0) {
      issues.push('At least one tag is required');
    }

    return { valid: issues.length === 0, issues };
  }

  function extractImagesFromContent(content: string): string[] {
    // Match markdown image syntax ![alt](/blog-images/image.jpg) and HTML img tags
    const markdownImageRegex = /!\[.*?\]\((\/blog-images\/[^)]+)\)/g;
    const htmlImageRegex = /<img[^>]+src=["'](\/blog-images\/[^"']+)["'][^>]*>/g;
    
    const images = new Set<string>();
    
    // Extract markdown images
    let match;
    while ((match = markdownImageRegex.exec(content)) !== null) {
      images.add(match[1]);
    }
    
    // Extract HTML images
    while ((match = htmlImageRegex.exec(content)) !== null) {
      images.add(match[1]);
    }
    
    return Array.from(images);
  }

  async function validateBlogPost(filePath: string): Promise<boolean> {
    console.log(`\nValidating ${filePath}...`);
    let isValid = true;
    let hasWarnings = false;

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);

      if (!frontmatterMatch) {
        console.error('❌ No frontmatter found in the blog post');
        return false;
      }

      const frontmatter = yaml.load(frontmatterMatch[1]) as BlogFrontmatter;
      const slug = path.basename(filePath, '.mdx');
      const contentWithoutFrontmatter = content.replace(/---\n[\s\S]*?\n---/, '').trim();

      // Spell check content
      const misspellings = await spellCheckContent(contentWithoutFrontmatter);
      if (misspellings.length > 0) {
        console.warn('\n⚠️  Potential spelling issues:');
        misspellings.forEach(({ word, suggestions }) => {
          console.warn(`   - "${word}" - Suggestions: ${suggestions.join(', ')}`);
        });
        hasWarnings = true;
      }

      // Validate frontmatter fields
      const fieldsValidation = validateFrontmatterFields(frontmatter);
      if (!fieldsValidation.valid) {
        console.error('❌ Frontmatter validation failed:');
        fieldsValidation.issues.forEach(issue => console.error(`   - ${issue}`));
        isValid = false;
      }

      // Validate main image
      const mainImageValidation = await validateImage(frontmatter.mainImage, true);
      if (!mainImageValidation.valid) {
        console.error('❌ Main image validation failed:');
        mainImageValidation.issues.forEach(issue => console.error(`   - ${issue}`));
        isValid = false;
      }
      if (mainImageValidation.warnings.length > 0) {
        console.warn('⚠️  Main image warnings:');
        mainImageValidation.warnings.forEach(warning => console.warn(`   - ${warning}`));
        hasWarnings = true;
      }

      // Validate og image if different from main image
      if (frontmatter.ogImage !== frontmatter.mainImage) {
        const ogImageValidation = await validateImage(frontmatter.ogImage, true);
        if (!ogImageValidation.valid) {
          console.error('❌ OG image validation failed:');
          ogImageValidation.issues.forEach(issue => console.error(`   - ${issue}`));
          isValid = false;
        }
        if (ogImageValidation.warnings.length > 0) {
          console.warn('⚠️  OG image warnings:');
          ogImageValidation.warnings.forEach(warning => console.warn(`   - ${warning}`));
          hasWarnings = true;
        }
      }

      // Validate all images in content
      const contentImages = extractImagesFromContent(contentWithoutFrontmatter);
      if (contentImages.length > 0) {
        console.log('\nValidating content images...');
        for (const imagePath of contentImages) {
          const imageValidation = await validateImage(imagePath, false);
          if (!imageValidation.valid) {
            console.error(`❌ Content image validation failed for ${imagePath}:`);
            imageValidation.issues.forEach(issue => console.error(`   - ${issue}`));
            isValid = false;
          }
        }
      }

      // Validate UTM parameters
      const utmValidation = validateUtmParameters(frontmatter.ctaLink, slug);
      if (!utmValidation.valid) {
        console.error('❌ UTM parameter validation failed:');
        utmValidation.issues.forEach(issue => console.error(`   - ${issue}`));
        isValid = false;
      }

      // Validate related posts
      const relatedValidation = validateRelatedPosts(frontmatter.relatedPosts);
      if (!relatedValidation.valid) {
        console.error('❌ Related posts validation failed:');
        relatedValidation.issues.forEach(issue => console.error(`   - ${issue}`));
        isValid = false;
      }

      // Content length validation
      const wordCount = contentWithoutFrontmatter.split(/\s+/).length;
      if (wordCount < 300) {
        console.error('❌ Content is too short:');
        console.error(`   - Post should be at least 300 words (current: ${wordCount} words)`);
        isValid = false;
      }

      if (isValid) {
        console.log('✅ Blog post validation passed!');
        if (hasWarnings) {
          console.log('   Note: There are warnings above that you may want to address');
        }
      } else {
        console.log('\n❌ Blog post validation failed. Please fix the issues above and try again.');
      }

      return isValid;

    } catch (error) {
      console.error('❌ Error validating blog post:', error.message);
      return false;
    }
  }

  program
    .argument('<file>', 'Blog post file to validate')
    .action(async (file) => {
      try {
        const isValid = await validateBlogPost(file);
        process.exit(isValid ? 0 : 1);
      } catch (error) {
        console.error('Error:', error);
        process.exit(1);
      }
    });

  program.parse();
})(); 
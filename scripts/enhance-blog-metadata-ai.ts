import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import OpenAI from 'openai'

const POSTS_DIRECTORY = path.join(process.cwd(), 'app/blog/posts')
const DEFAULT_CTA_BUTTON = 'Try Release for Free'
const AVAILABLE_CATEGORIES = [
  'ai',
  'customer-stories',
  'events',
  'kubernetes',
  'nvidia',
  'news',
  'platform-engineering',
  'product'
]

// Parse command line arguments
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const processAllFiles = args.includes('--all')
const forceUpdate = args.includes('--force')
const fileArg = args.find(arg => arg.endsWith('.mdx'))

if (!processAllFiles && !fileArg) {
  console.error('Error: Must provide either --all or a specific .mdx file')
  process.exit(1)
}

// Check for OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY environment variable is required')
  process.exit(1)
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

if (isDryRun) {
  console.log('Dry run - no files will be modified')
}

async function generateMetadata(content: string, title: string, slug: string): Promise<{ 
  ctaCopy: string, 
  ctaButton: string,
  ctaLink: string,
  categories: string[]
}> {
  const MAX_RETRIES = 3;
  let ctaCopy = '';
  let categories: string[] = [];
  
  for (let i = 0; i < MAX_RETRIES && !ctaCopy; i++) {
    const prompt = `
      Analyze this technical blog post and generate metadata in the following format:

      Title: "${title}"

      Blog Content:
      ${content.slice(0, 3000)}...

      About Release.com:
      Release.com provides ephemeral, on-demand environments for development, testing, and staging, allowing teams to streamline workflows, reduce infrastructure costs, and accelerate deployment cycles. By automatically spinning up full-stack environments that mirror production, Release enables seamless collaboration, faster bug resolution, and more efficient testing. This eliminates the bottlenecks of shared staging environments, reduces configuration drift, and ensures consistent deployments. With built-in integrations and automation, teams can focus on building and shipping software without worrying about managing infrastructure.

      Please respond in this exact format:

      CTA:
      [Your call-to-action message here that connects the blog post topic to how Release's environment management platform can help]

      CATEGORIES:
      [comma-separated list of relevant categories]

      Requirements for CTA:
      - Maximum 20 words
      - Speak directly to technical readers (developers, DevOps engineers, engineering leaders)
      - Avoid marketing jargon and buzzwords
      - Focus on concrete technical benefits
      - Connect the blog post's topic to Release's environment management capabilities
      - Reference specific concepts from the article where relevant

      Available categories: ${AVAILABLE_CATEGORIES.join(', ')}
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a technical writer who creates precise, clear call-to-action messages for developer tools and platforms. Always follow the exact response format requested."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5, // Reduced for more consistent outputs
    })

    const response = completion.choices[0].message.content || ''

    // More precise regex patterns for extraction
    const ctaMatch = response.match(/CTA:\s*\n(.*?)(?=\n\s*CATEGORIES:|$)/s)?.[1]?.trim()
    const categoriesMatch = response.match(/CATEGORIES:\s*\n(.*?)(?=\n|$)/s)?.[1]?.trim()

    if (ctaMatch && ctaMatch.length > 0) {
      ctaCopy = ctaMatch
    }

    if (!categories.length && categoriesMatch) {
      categories = categoriesMatch
        .split(',')
        .map(c => c.trim().toLowerCase())
        .filter(c => AVAILABLE_CATEGORIES.some(cat => cat === c))
    }

    if (!ctaCopy) {
      console.log(`Retry ${i + 1}: Empty CTA response received for "${title}", retrying...`)
    }
  }

  // If we still don't have a CTA after retries, use a fallback
  if (!ctaCopy) {
    console.warn(`Warning: Using fallback CTA for "${title}" after ${MAX_RETRIES} failed attempts`)
    ctaCopy = `Try Release to streamline your ${title.toLowerCase()} workflow.`
  }

  // Ensure we always have at least one category
  if (categories.length === 0) {
    categories = ['product']
  }

  const ctaLink = `https://release.com/signup?utm_source=blog&utm_medium=cta&utm_campaign=blog-cta&utm_content=${slug}`

  return {
    ctaCopy,
    ctaButton: DEFAULT_CTA_BUTTON,
    ctaLink,
    categories
  }
}

async function enhancePostMetadata(filename: string) {
  try {
    const filePath = path.join(POSTS_DIRECTORY, filename)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    
    const { data: frontmatter, content } = matter(fileContent)
    const changes: string[] = []

    // Get slug from filename by removing .mdx extension
    const slug = filename.replace('.mdx', '')

    // Check if we need to update any fields - respect force parameter regardless of dry run
    const needsUpdate = forceUpdate || 
      !frontmatter.ctaCopy ||
      !frontmatter.ctaButton ||
      !frontmatter.ctaLink ||
      !frontmatter.categories ||
      frontmatter.categories.length === 0

    // Skip OpenAI call if no updates needed
    if (!needsUpdate) {
      console.log(`\nNo updates needed for ${filename}`)
      return
    }

    // Only call OpenAI if we need to update something
    const { ctaCopy, ctaButton, ctaLink, categories } = await generateMetadata(content, frontmatter.title, slug)

    // Check fields based on force parameter, regardless of dry run
    if (forceUpdate || !frontmatter.ctaCopy) {
      changes.push(`- Adding ctaCopy: "${ctaCopy}"`)
      frontmatter.ctaCopy = ctaCopy
    }

    if (forceUpdate || !frontmatter.ctaButton) {
      changes.push(`- Adding ctaButton: "${ctaButton}"`)
      frontmatter.ctaButton = ctaButton
    }

    if (forceUpdate || !frontmatter.ctaLink) {
      changes.push(`- Adding ctaLink: "${ctaLink}"`)
      frontmatter.ctaLink = ctaLink
    }

    if (forceUpdate || !frontmatter.categories || frontmatter.categories.length === 0) {
      changes.push(`- Adding categories: ${categories.join(', ')}`)
      frontmatter.categories = categories
      // Update tags to match categories if they're empty or force update is enabled
      if (forceUpdate || !frontmatter.tags || frontmatter.tags.length === 0) {
        frontmatter.tags = categories
      }
    }

    // Convert back to MDX string
    const updatedContent = matter.stringify(content, frontmatter)
    
    // Only write files if not in dry run mode
    if (!isDryRun && changes.length > 0) {
      fs.writeFileSync(filePath, updatedContent)
    }
    
    // Always show changes that would be made
    if (changes.length > 0) {
      console.log(`\n${isDryRun ? '[DRY RUN] ' : ''}Changes for ${filename}:`)
      changes.forEach(change => console.log(change))
    } else {
      console.log(`\n${isDryRun ? '[DRY RUN] ' : ''}No changes needed for ${filename}`)
    }

  } catch (error) {
    console.error(`Error processing ${filename}:`, error)
  }
}

async function processFiles() {
  if (processAllFiles) {
    const files = fs.readdirSync(POSTS_DIRECTORY)
    const mdxFiles = files.filter(file => file.endsWith('.mdx'))

    for (const filename of mdxFiles) {
      await enhancePostMetadata(filename)
    }
    console.log('\nAll files processed successfully!')
  } else {
    // Process single file
    if (!fs.existsSync(path.join(POSTS_DIRECTORY, fileArg!))) {
      console.error(`Error: File ${fileArg} not found in ${POSTS_DIRECTORY}`)
      process.exit(1)
    }
    await enhancePostMetadata(fileArg!)
    console.log('\nFile processed successfully!')
  }
}

processFiles() 
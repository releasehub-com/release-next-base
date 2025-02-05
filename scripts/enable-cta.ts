import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const POSTS_DIRECTORY = path.join(process.cwd(), 'app/blog/posts')

// Parse command line arguments
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')

if (isDryRun) {
  console.log('Dry run - no files will be modified')
}

async function enableCTA(filename: string) {
  try {
    const filePath = path.join(POSTS_DIRECTORY, filename)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    
    const { data: frontmatter, content } = matter(fileContent)
    
    // Only update if showCTA is not already true
    if (frontmatter.showCTA !== true) {
      frontmatter.showCTA = true
      
      // Convert back to MDX string
      const updatedContent = matter.stringify(content, frontmatter)
      
      console.log(`${isDryRun ? '[DRY RUN] ' : ''}Enabling CTA for ${filename}`)
      
      if (!isDryRun) {
        fs.writeFileSync(filePath, updatedContent)
      }
    } else {
      console.log(`${isDryRun ? '[DRY RUN] ' : ''}CTA already enabled for ${filename}`)
    }

  } catch (error) {
    console.error(`Error processing ${filename}:`, error)
  }
}

async function processFiles() {
  // Get all MDX files
  const mdxFiles = fs.readdirSync(POSTS_DIRECTORY)
    .filter(filename => filename.endsWith('.mdx'))

  console.log(`Processing ${mdxFiles.length} MDX files...\n`)

  for (const filename of mdxFiles) {
    await enableCTA(filename)
  }

  console.log('\nAll files processed successfully!')
}

processFiles() 
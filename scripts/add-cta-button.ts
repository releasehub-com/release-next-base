import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const POSTS_DIRECTORY = path.join(process.cwd(), 'app/blog/posts')
const DEFAULT_CTA_BUTTON = 'Try Release for Free'

// Add command line argument for dry run
const isDryRun = process.argv.includes('--dry-run')
if (isDryRun) {
  console.log('Dry run - no files will be modified')
}

function addCtaButton() {
  const files = fs.readdirSync(POSTS_DIRECTORY)
  const mdxFiles = files.filter(file => file.endsWith('.mdx'))

  mdxFiles.forEach(filename => {
    const filePath = path.join(POSTS_DIRECTORY, filename)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    
    // Parse the frontmatter and content
    const { data, content } = matter(fileContent)
    const frontmatter = data as Record<string, any>
    const changes: string[] = []

    // Add ctaButton if it doesn't exist
    if (!frontmatter.ctaButton) {
      changes.push(`- Adding ctaButton: "${DEFAULT_CTA_BUTTON}"`)
      frontmatter.ctaButton = DEFAULT_CTA_BUTTON
    }

    // Convert back to MDX string
    const updatedContent = matter.stringify(content, frontmatter)
    
    if (!isDryRun) {
      // Write back to file
      fs.writeFileSync(filePath, updatedContent)
    }
    
    if (isDryRun) {
      if (changes.length > 0) {
        console.log(`\n[DRY RUN] Changes for ${filename}:`)
        changes.forEach(change => console.log(change))
      } else {
        console.log(`\n[DRY RUN] No changes needed for ${filename}`)
      }
    } else {
      if (changes.length > 0) {
        console.log(`Updated ${filename}`)
      }
    }
  })

  console.log('\nAll files processed successfully!')
}

addCtaButton() 
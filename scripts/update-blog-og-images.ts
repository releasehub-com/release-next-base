import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIRECTORY = path.join(process.cwd(), "app/blog/posts");
const DEFAULT_OG_IMAGE = "/blog/default-og-image.png";

function updatePostFrontmatter(force = false) {
  // Get all MDX files
  const files = fs.readdirSync(POSTS_DIRECTORY);
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

  mdxFiles.forEach((filename) => {
    const filePath = path.join(POSTS_DIRECTORY, filename);
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Parse the frontmatter
    const { data, content } = matter(fileContent);

    // Update ogImage based on force parameter
    const shouldUpdate = force || !data.ogImage;
    if (shouldUpdate) {
      data.ogImage = data.mainImage || DEFAULT_OG_IMAGE;
    }

    // Convert back to MDX string
    const updatedContent = matter.stringify(content, data);

    // Write back to file
    fs.writeFileSync(filePath, updatedContent);

    console.log(`Updated ${filename} with OG image: ${data.ogImage}`);
  });

  console.log("\nAll files updated successfully!");
}

// Get force parameter from command line arguments
const force = process.argv.includes("--force");
updatePostFrontmatter(force);

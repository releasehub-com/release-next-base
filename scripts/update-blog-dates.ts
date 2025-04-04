import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { parse } from "csv-parse/sync";

const POSTS_DIRECTORY = path.join(process.cwd(), "app/blog/posts");
const CSV_PATH = path.join(process.cwd(), "release-blog-posts.csv");

// Parse command line arguments
const isDryRun = process.argv.includes("--dry-run");
if (isDryRun) {
  console.log("Dry run - no files will be modified");
}

interface BlogPost {
  Slug: string;
  "Created On": string;
}

function updatePublishDates() {
  // Read and parse CSV file
  const csvContent = fs.readFileSync(CSV_PATH, "utf-8");
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as BlogPost[];

  // Create a map of slug to created date
  const dateMap = new Map(
    records.map((record) => [record.Slug, record["Created On"]]),
  );

  // Get all MDX files
  const files = fs
    .readdirSync(POSTS_DIRECTORY)
    .filter((file) => file.endsWith(".mdx"));

  files.forEach((filename) => {
    const filePath = path.join(POSTS_DIRECTORY, filename);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const slug = filename.replace(".mdx", "");

    // Get created date from CSV
    const createdDate = dateMap.get(slug);
    if (!createdDate) {
      console.warn(`No created date found in CSV for ${slug}`);
      return;
    }

    // Parse the frontmatter
    const { data, content } = matter(fileContent);

    // Update the publishDate
    const oldDate = data.publishDate;
    data.publishDate = createdDate;

    if (oldDate === createdDate) {
      console.log(`${filename}: Date unchanged (${createdDate})`);
      return;
    }

    if (isDryRun) {
      console.log(`[DRY RUN] Would update ${filename}:`);
      console.log(`  Old date: ${oldDate}`);
      console.log(`  New date: ${createdDate}`);
    } else {
      // Convert back to MDX string
      const updatedContent = matter.stringify(content, data);

      // Write back to file
      fs.writeFileSync(filePath, updatedContent);
      console.log(`Updated ${filename}:`);
      console.log(`  Old date: ${oldDate}`);
      console.log(`  New date: ${createdDate}`);
    }
  });

  console.log("\nAll files processed successfully!");
}

updatePublishDates();

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const OLD_IMAGES_DIR = path.join(process.cwd(), "public/images/case-studies");
const NEW_IMAGES_DIR = path.join(process.cwd(), "public/case-study-images");
const CASE_STUDIES_DIR = path.join(process.cwd(), "app/case-studies/content");

// Ensure new directory exists
fs.mkdirSync(NEW_IMAGES_DIR, { recursive: true });

function updateImagePaths() {
  const caseStudies = fs.readdirSync(CASE_STUDIES_DIR);

  caseStudies.forEach((filename) => {
    if (!filename.endsWith(".mdx")) return;

    const filePath = path.join(CASE_STUDIES_DIR, filename);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);

    // Update image paths in frontmatter
    if (data.logo) {
      const oldPath = path.join(process.cwd(), "public", data.logo);
      const imageName = path.basename(data.logo);
      const newPath = `/case-study-images/${imageName}`;
      data.logo = newPath;

      // Move the file if it exists
      if (fs.existsSync(oldPath)) {
        fs.copyFileSync(oldPath, path.join(NEW_IMAGES_DIR, imageName));
        console.log(`Moved logo: ${imageName}`);
      }
    }

    if (data.thumbnail) {
      const oldPath = path.join(process.cwd(), "public", data.thumbnail);
      const imageName = path.basename(data.thumbnail);
      const newPath = `/case-study-images/${imageName}`;
      data.thumbnail = newPath;

      // Move the file if it exists
      if (fs.existsSync(oldPath)) {
        fs.copyFileSync(oldPath, path.join(NEW_IMAGES_DIR, imageName));
        console.log(`Moved thumbnail: ${imageName}`);
      }
    }

    // Write updated MDX file
    const updatedContent = matter.stringify(content, data);
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Updated paths in: ${filename}`);
  });

  console.log("All case study images moved and paths updated!");
}

updateImagePaths();

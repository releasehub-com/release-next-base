import { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import CaseStudyIndex from "./components/CaseStudyIndex";
import { CaseStudy, CaseStudyFrontmatter } from "./types";
import { metadata } from "./metadata";
import Header from "@/components/shared/layout/Header";
import Footer from "@/components/shared/layout/Footer";

export { metadata };

function getCaseStudies(): CaseStudy[] {
  try {
    const caseStudiesDirectory = path.join(
      process.cwd(),
      "app/case-studies/content",
    );

    // Check if directory exists
    if (!fs.existsSync(caseStudiesDirectory)) {
      console.error(
        `Case studies directory not found: ${caseStudiesDirectory}`,
      );
      return [];
    }

    const filenames = fs.readdirSync(caseStudiesDirectory);
    console.log(`Found ${filenames.length} files in case studies directory`);

    const studies = filenames
      .filter((filename) => filename.endsWith(".mdx"))
      .map((filename) => {
        try {
          const filePath = path.join(caseStudiesDirectory, filename);
          const fileContent = fs.readFileSync(filePath, "utf8");
          const { data } = matter(fileContent);

          return {
            slug: filename.replace(".mdx", ""),
            frontmatter: data as CaseStudyFrontmatter,
          };
        } catch (error) {
          console.error(`Error processing case study ${filename}:`, error);
          return null;
        }
      })
      .filter((study): study is CaseStudy => study !== null)
      .sort((a, b) => {
        return (
          new Date(b.frontmatter.publishDate).getTime() -
          new Date(a.frontmatter.publishDate).getTime()
        );
      });

    console.log(`Successfully processed ${studies.length} case studies`);
    return studies;
  } catch (error) {
    console.error("Error in getCaseStudies:", error);
    return [];
  }
}

export default function CaseStudiesPage() {
  const caseStudies = getCaseStudies();

  // If no case studies found, we could render a fallback UI
  if (caseStudies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Case Studies Coming Soon
          </h1>
          <p className="text-gray-400">
            We're currently preparing our case studies. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        <CaseStudyIndex caseStudies={caseStudies} />
      </main>
      <Footer />
    </>
  );
}

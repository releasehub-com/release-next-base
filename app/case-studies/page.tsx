import { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import CaseStudyIndex from "./components/CaseStudyIndex";
import { CaseStudy, CaseStudyFrontmatter } from "./types";

export const metadata: Metadata = {
  title: "Case Studies | Release",
  description:
    "Learn how companies are using Release to improve their development workflow",
};

function getCaseStudies(): CaseStudy[] {
  const caseStudiesDirectory = path.join(
    process.cwd(),
    "app/case-studies/content",
  );
  const filenames = fs.readdirSync(caseStudiesDirectory);

  return filenames
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => {
      const filePath = path.join(caseStudiesDirectory, filename);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContent);

      return {
        slug: filename.replace(".mdx", ""),
        frontmatter: data as CaseStudyFrontmatter,
      };
    })
    .sort((a, b) => {
      return (
        new Date(b.frontmatter.publishDate).getTime() -
        new Date(a.frontmatter.publishDate).getTime()
      );
    });
}

export default function CaseStudiesPage() {
  const caseStudies = getCaseStudies();

  return <CaseStudyIndex caseStudies={caseStudies} />;
}

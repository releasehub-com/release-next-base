import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { CaseStudyFrontmatter } from "../types";
import CaseStudyPage from "../components/CaseStudyPage";
import CaseStudyCTA from "../components/CaseStudyCTA";

const components = {
  CaseStudyCTA,
};

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const caseStudy = getCaseStudy(params.slug);
  if (!caseStudy) return {};

  const { frontmatter } = caseStudy;

  return {
    title: `${frontmatter.title} | Release Case Study`,
    description: frontmatter.description,
    openGraph: {
      title: `${frontmatter.title} | Release Case Study`,
      description: frontmatter.description,
      type: "article",
      url: `https://release.com/case-studies/${params.slug}`,
      images: [
        {
          url: frontmatter.logo,
          width: 1200,
          height: 630,
          alt: `${frontmatter.title} logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${frontmatter.title} | Release Case Study`,
      description: frontmatter.description,
      images: [frontmatter.logo],
    },
  };
}

function getCaseStudy(slug: string) {
  const caseStudiesDirectory = path.join(
    process.cwd(),
    "app/case-studies/content",
  );
  const fullPath = path.join(caseStudiesDirectory, `${slug}.mdx`);

  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    return {
      frontmatter: data as CaseStudyFrontmatter,
      content,
    };
  } catch (e) {
    return null;
  }
}

export default function CaseStudySlugPage({ params }: Props) {
  const caseStudy = getCaseStudy(params.slug);
  if (!caseStudy) notFound();

  return (
    <CaseStudyPage
      content={<MDXRemote source={caseStudy.content} components={components} />}
      frontmatter={caseStudy.frontmatter}
    />
  );
}

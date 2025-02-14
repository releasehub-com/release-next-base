import { notFound } from "next/navigation";
import LegalLayout from "@/components/shared/layout/LegalLayout";
import MDXContent from "@/app/legal/components/MDXContent";
import { getLegalContent, getAllLegalSlugs } from "@/app/legal/lib/content";
import { Metadata } from "next";

export async function generateStaticParams() {
  try {
    const slugs = getAllLegalSlugs();
    return slugs.map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.error("Error generating static params for legal pages:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const content = getLegalContent(params.slug);
    return {
      title: `${content.frontmatter.title} | Release Legal`,
      description: "Legal information for Release platform and services.",
    };
  } catch (error) {
    return {
      title: "Legal Document Not Found | Release",
      description: "The requested legal document could not be found.",
    };
  }
}

export default async function LegalPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const content = getLegalContent(params.slug);
    if (!content) {
      notFound();
    }

    return (
      <LegalLayout>
        <MDXContent source={content.content} />
      </LegalLayout>
    );
  } catch (error) {
    console.error(`Error rendering legal page ${params.slug}:`, error);
    notFound();
  }
}

import { notFound } from "next/navigation";
import LegalLayout from "@/components/shared/layout/LegalLayout";
import MDXContent from "@/app/legal/components/MDXContent";
import { getLegalContent, getAllLegalSlugs } from "@/app/legal/lib/content";
import { Metadata } from "next";

export async function generateStaticParams() {
  const slugs = getAllLegalSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const { frontmatter } = getLegalContent(params.slug);
    return {
      title: `${frontmatter.title} - Release`,
      description: "Legal information for Release platform and services.",
    };
  } catch (error) {
    return {
      title: "Legal - Release",
      description: "Legal information for Release platform and services.",
    };
  }
}

export default function LegalPage({ params }: { params: { slug: string } }) {
  try {
    const { content } = getLegalContent(params.slug);

    return (
      <LegalLayout>
        <MDXContent source={content} />
      </LegalLayout>
    );
  } catch (error) {
    notFound();
  }
}

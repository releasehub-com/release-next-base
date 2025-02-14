import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPartnerBySlug, getPartners } from "../utils";
import { MDXRemote } from "next-mdx-remote/rsc";
import PartnerCTA from "../components/PartnerCTA";
import Header from "@/components/shared/layout/Header";
import Footer from "@/components/shared/layout/Footer";
import Image from "next/image";
import { Metadata } from "next";

export async function generateStaticParams() {
  try {
    const partners = getPartners();
    return partners.map((partner) => ({
      slug: partner.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for partners:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const partner = getPartnerBySlug(params.slug);
    if (!partner) {
      return {
        title: "Partner Not Found | Release",
        description: "The requested partner information could not be found.",
      };
    }
    return {
      title: `${partner.title} | Release Partners`,
      description: partner.description || "Release partner information",
      openGraph: {
        title: partner.title,
        description: partner.description,
        images: partner.logo ? [partner.logo] : [],
      },
    };
  } catch (error) {
    return {
      title: "Partner Not Found | Release",
      description: "The requested partner information could not be found.",
    };
  }
}

function PartnerContent({ params }: { params: { slug: string } }) {
  try {
    const partner = getPartnerBySlug(params.slug);
    if (!partner) {
      notFound();
    }

    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-8 mb-8">
            {partner.logo && (
              <div className="relative w-32 h-16">
                <Image
                  src={partner.logo}
                  alt={partner.title}
                  fill
                  className="object-contain"
                  unoptimized={true}
                />
              </div>
            )}
            <h1 className="text-4xl font-bold text-white">{partner.title}</h1>
          </div>
          <p className="text-xl text-gray-300">{partner.description}</p>
        </div>

        <div className="prose prose-invert max-w-none">
          <MDXRemote source={partner.content || ""} />
        </div>

        <div className="mt-12">
          <PartnerCTA partner={partner.name} />
        </div>
      </div>
    );
  } catch (error) {
    console.error(`Error rendering partner page ${params.slug}:`, error);
    notFound();
  }
}

export default async function PartnerPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        <Suspense fallback={<div>Loading...</div>}>
          <PartnerContent params={params} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

import { notFound } from "next/navigation";
import { getPartnerBySlug, getPartners } from "../utils";
import { MDXRemote } from "next-mdx-remote/rsc";
import PartnerCTA from "../components/PartnerCTA";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

export async function generateStaticParams() {
  const partners = getPartners();
  return partners.map((partner) => ({
    slug: partner.slug,
  }));
}

export default function PartnerPage({ params }: { params: { slug: string } }) {
  const partner = getPartnerBySlug(params.slug);

  if (!partner) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-gray-800/50 to-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1">
                <div className="text-purple-400 font-medium mb-4">
                  {partner.category}
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  {partner.title}
                </h1>
                <p className="text-gray-300 text-lg mb-8">
                  {partner.description}
                </p>
                {partner.buttonCopy && (
                  <a
                    href={partner.buttonLink || "https://release.com/signup"}
                    className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {partner.buttonCopy}
                  </a>
                )}
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-gray-800 rounded-lg overflow-hidden w-full max-w-md">
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src={partner.mainImage || partner.logo}
                      alt={partner.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Section */}
        {partner.featureTitle && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-8">
                    {partner.featureTitle}
                  </h2>
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: partner.featureList || "",
                    }}
                  />
                </div>
                {partner.featureImage && (
                  <div className="flex-1 flex justify-center">
                    <div className="w-full max-w-md">
                      <Image
                        src={partner.featureImage}
                        alt={partner.featureTitle}
                        width={500}
                        height={500}
                        className="w-full h-auto"
                        unoptimized
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Better Together Section */}
        {partner.betterTitle && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-white text-center mb-4">
                {partner.betterTitle}
              </h2>
              {partner.betterDescription && (
                <p className="text-gray-300 text-center max-w-3xl mx-auto mb-16">
                  {partner.betterDescription}
                </p>
              )}
              {partner.betterCards && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {partner.betterCards.map((card, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-6">
                      <div
                        dangerouslySetInnerHTML={{ __html: card }}
                        className="prose prose-invert max-w-none [&_img]:brightness-0 [&_img]:invert [&_figure]:m-0 [&_figure_div]:mb-4"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Content Section */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-invert max-w-none">
              <MDXRemote source={partner.content || ""} />
            </div>
          </div>
        </section>

        {/* Partner CTA Section */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <PartnerCTA />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

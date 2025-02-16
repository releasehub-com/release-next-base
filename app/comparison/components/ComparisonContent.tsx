"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckIcon, XIcon, ArrowRightIcon } from "lucide-react";
import Header from "@/components/shared/layout/Header";
import Footer from "@/components/shared/layout/Footer";
import { gitlabFeatures } from "../gitlab/features";
import { signadotFeatures } from "../signadot/features";
import { bunnyshellFeatures } from "../bunnyshell/features";
import { qoveryFeatures } from "../qovery/features";
import { shipyardFeatures } from "../shipyard/features";

const competitors = [
  { name: "GitLab", features: gitlabFeatures, path: "/comparison/gitlab" },
  {
    name: "Signadot",
    features: signadotFeatures,
    path: "/comparison/signadot",
  },
  {
    name: "Bunnyshell",
    features: bunnyshellFeatures,
    path: "/comparison/bunnyshell",
  },
  { name: "Qovery", features: qoveryFeatures, path: "/comparison/qovery" },
  {
    name: "Shipyard",
    features: shipyardFeatures,
    path: "/comparison/shipyard",
  },
];

export default function ComparisonContent() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-grow">
        <section className="py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-[#00bb93]">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Release vs. Competitors
            </h1>
            <p className="text-xl mb-8">
              Discover how Release outperforms other DevOps platforms across key
              features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="https://release.com/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#00bb93] text-white hover:bg-[#00bb93]/90 font-bold"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/book-a-demo">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-[#00bb93] hover:bg-gray-100 font-bold"
                >
                  Schedule a chat with a Release founder
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          {competitors.map((competitor) => (
            <Card
              key={competitor.name}
              className="mb-8 bg-gray-800 border-gray-700"
            >
              <CardHeader className="bg-gray-700">
                <CardTitle className="text-2xl font-bold text-white">
                  Release vs. {competitor.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  {competitor.features.slice(0, 3).map((feature) => (
                    <div
                      key={feature.name}
                      className="bg-gray-700 p-4 rounded-lg"
                    >
                      <h3 className="text-lg font-semibold mb-2 text-[#00bb93]">
                        {feature.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        <div className="w-1/2 flex items-center">
                          <CheckIcon className="h-5 w-5 text-[#00bb93] mr-2" />
                          <span className="text-white">Release</span>
                        </div>
                        <div className="w-1/2 flex items-center">
                          {feature.competitor ? (
                            <CheckIcon className="h-5 w-5 text-yellow-500 mr-2" />
                          ) : (
                            <XIcon className="h-5 w-5 text-red-500 mr-2" />
                          )}
                          <span className="text-gray-300">
                            {competitor.name}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link href={competitor.path}>
                    <Button className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90">
                      See full comparison of Release vs. {competitor.name}
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}

          <section className="text-center mt-16">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Experience the Release Difference?
            </h2>
            <p className="text-xl mb-8">
              Join the companies that have accelerated their development and
              reduced costs with Release.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="https://release.com/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#00bb93] text-white hover:bg-[#00bb93]/90 font-bold"
                >
                  Start Your Free Trial
                </Button>
              </Link>
              <Link href="/book-a-demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-[#00bb93] text-[#00bb93] hover:bg-[#00bb93] hover:text-white font-bold"
                >
                  Schedule a chat with a Release founder
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import type { Metadata } from "next";
import RootSEOPageLayout from "@/components/shared/layout/RootSEOPageLayout";
import Image from "next/image";

export const metadata: Metadata = {
  title: "User Acceptance Testing (UAT) with Release Ephemeral Environments",
  description:
    "Learn how Release's Ephemeral Environments enable efficient User Acceptance Testing (UAT) for Product Managers, Designers, QA teams, and stakeholders.",
  openGraph: {
    title: "User Acceptance Testing (UAT) with Release Ephemeral Environments",
    description:
      "Learn how Release's Ephemeral Environments enable efficient User Acceptance Testing (UAT) for Product Managers, Designers, QA teams, and stakeholders.",
    type: "article",
    url: "https://release.com/user-acceptance-testing-with-ephemeral-environments",
    images: [
      {
        url: "https://release.com/og/user-acceptance-testing.png",
        width: 1200,
        height: 630,
        alt: "User Acceptance Testing with Release",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "User Acceptance Testing (UAT) with Release Ephemeral Environments",
    description:
      "Learn how Release's Ephemeral Environments enable efficient User Acceptance Testing (UAT) for Product Managers, Designers, QA teams, and stakeholders.",
    images: ["https://release.com/og/user-acceptance-testing.png"],
  },
  alternates: {
    canonical:
      "https://release.com/user-acceptance-testing-with-ephemeral-environments",
  },
};

export default function UATPage() {
  return (
    <RootSEOPageLayout
      title="User Acceptance Testing (UAT) with Release Ephemeral Environments"
      description="Learn how Release's Ephemeral Environments enable efficient User Acceptance Testing (UAT) for Product Managers, Designers, QA teams, and stakeholders."
    >
      <div className="text-lg text-gray-300 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-6 border-b border-gray-800 pb-4">
          Product Managers, Designers, QA teams, and product stakeholders are
          always last in line...
        </h2>

        <p className="leading-relaxed">
          Are you a Product Manager or Designer that would love to get a sneak
          peak at new features being built? Have you ever had to perform User
          Acceptance Testing (UAT) without a trusted environment? Have you ever
          wanted a demo environment, but find it too cumbersome and expensive
          for your DevOps to spin up for you? Does your QA team struggle with
          having enough environments they trust for feature testing? With
          Release's{" "}
          <em className="italic text-gray-300">Ephemeral Environments</em>, it's
          possible to view a developer's changes at any time or any place. You
          don't need to worry about having the proper environment variables in
          place or running any code locally.
        </p>

        <blockquote className="border-l-4 border-[#00bb93] pl-6 my-6 text-gray-300 italic text-xl">
          If you have the ability to ideate quicker using environments, then you
          can refine your product with features that are truly worthwhile to
          users.
        </blockquote>

        <p className="leading-relaxed">
          Environments are a critical resource needed by Product Managers,
          Designers, QA teams and product stakeholders, but they are difficult
          and expensive for DevOps teams to create and maintain. It's hard
          enough to create environments for the core development team, let alone
          environments for these auxiliary support roles for their needs.
          Usually this means these roles have to do without, which results in
          slower than ideal product velocity and less than ideal product
          solutions.
        </p>

        <p className="leading-relaxed">
          Teams typically measure throughput velocity by measuring the number of
          features released over time. This standard metric is worthwhile in
          knowing how fast things are pushed out the door, but there is still a
          challenge in knowing if those changes are relevant and important to
          the customer. Yes, you may be pushing out features, but are they
          features your customers want? If you have the ability to ideate
          quicker with stakeholders viewing and giving feedback in the
          development process then you can refine your product faster with
          features that are truly worthwhile to users.
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-6 border-b border-gray-800 pb-4">
          Current Product Management Software Tools for sharing features are
          less than ideal...
        </h2>

        <p className="leading-relaxed">
          Sharing in-progress feature development is vital to ensuring features
          are developed correctly and meet customer needs. So how do companies
          usually solve sharing work-in-progress changes? Here are some of the
          current solutions and pitfalls to solve sharing development in
          progress:
        </p>

        <ul className="list-disc pl-8 mb-6 text-gray-300 space-y-2">
          <li>
            Sitting over your developer's shoulder (during covid quarantine this
            is likely a zoom). The downside is that you only get a 'show n tell'
            without the ability to fully experience the app.
          </li>
          <li>
            Use ngrok or another tunneling technology to portal into another
            local machine. This approach lacks prod-like data that won't
            persist, performance is limited to the local dev laptop, and the
            portal closes after a short time.
          </li>
          <li>
            Send static screenshots back-n-forth offers no dynamic
            interactivity.
          </li>
          <li>
            The most common solution is shared staging environments, but this
            single shared resource creates a bottleneck across the organization
            and you have to wait for access. Data can be changed out from under
            you making testing/previewing difficult too.
          </li>
        </ul>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-6 border-b border-gray-800 pb-4">
          Release Ephemeral Environments solve a major pain point for
          collaborative User Acceptance Testing (UAT)
        </h2>

        <p className="leading-relaxed">
          The main premise behind Release is to enable teams to move faster by
          previewing each other's work in rapid fashion automatically with every
          PR or at the click of a button. This opens up a new door for
          support-related roles to view work-in-progress through environment
          that may have been inaccessible before. Product Managers, UI/UX
          Designers, Quality Assurance (QA), Sales & Marketing teams, and Senior
          Management can now open up an environment and see new product changes
          while they are being developed. There are many use-cases ranging from:
          sales demos, stakeholder feedback meetings, previewing features, major
          product version launches, bug fixes, test databases, and user research
          focus groups.
        </p>

        <p className="leading-relaxed">
          Release Ephemeral Environments offer an accessible avenue for
          collaboration between developers and the various support roles that
          are all working toward a unified product vision.{" "}
          <strong className="text-white font-semibold">
            This allows for all team members to be involved as early as possible
            in the development process which increases velocity and quality,
            while removing costly rework.
          </strong>{" "}
          It can be counterproductive for people to work in silos, then find out
          later on during a team meeting that a new feature is off the mark.
          When development work is shared easily and often, it fosters a higher
          quality, faster product iteration which yields a competitive edge,
          delights your customer base, and boosts team morale.
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-6 border-b border-gray-800 pb-4">
          How do you share Release Ephemeral Environments with product
          development stakeholders?
        </h2>

        <p className="leading-relaxed">
          When a developer makes a feature branch in their source control
          system, Release automatically creates an ephemeral environment that
          anybody can preview with a simple URL to the environment. This makes
          UAT incredibly simple.
        </p>

        <div className="mt-8 space-y-8">
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Different methods for sharing Release Environments:
            </h3>
            <div className="space-y-6">
              <div className="border border-gray-700 rounded-lg p-4">
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">
                      Copy/paste the URL
                    </h4>
                    <p className="text-gray-300">Send via message or email</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <Image
                      src="/images/uat/share-url.png"
                      alt="Share URL example"
                      width={753}
                      height={249}
                      className="rounded-lg w-full h-auto"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-gray-700 rounded-lg p-4">
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">
                      Slack Integration
                    </h4>
                    <p className="text-gray-300">
                      Posts your PR environments into a channel for easy sharing
                    </p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <Image
                      src="/images/uat/slack-integration.png"
                      alt="Slack integration example"
                      width={753}
                      height={249}
                      className="rounded-lg w-full h-auto"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-gray-700 rounded-lg p-4">
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">
                      GitHub Integration
                    </h4>
                    <p className="text-gray-300">
                      Find a Pull Request and click the Environment link
                    </p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <Image
                      src="/images/uat/github-integration.png"
                      alt="GitHub integration example"
                      width={924}
                      height={677}
                      className="rounded-lg w-full h-auto"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-gray-700 rounded-lg p-4">
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">
                      Public Environment Sharing
                    </h4>
                    <p className="text-gray-300">
                      Enter a URL variable in Release which enables public
                      environment sharing
                    </p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <Image
                      src="/images/uat/public-sharing.png"
                      alt="Public sharing example"
                      width={1168}
                      height={494}
                      className="rounded-lg w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-6 border-b border-gray-800 pb-4">
          Conclusion
        </h2>

        <p className="leading-relaxed">
          Release Ephemeral Environments give your ENTIRE team a competitive
          edge when developing new product features and performing UAT. Support
          team members that are engaged in non-coding work can now participate
          early and often in the development cycle. DevOps teams can spend less
          time managing environments and spend more time working on vital needs
          of the business. The end result is faster development with products
          that truly meet customers needs.
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-6 border-b border-gray-800 pb-4">
          Related Resources
        </h2>

        <ul className="list-none pl-0 space-y-4">
          <li>
            <a
              href="/blog/user-acceptance-testing-best-practices"
              className="text-[#00bb93] hover:text-[#00bb93]/80 transition-colors flex items-center"
            >
              <span className="mr-2">→</span>
              User Acceptance Testing Best Practices
            </a>
          </li>
          <li>
            <a
              href="/staging-environments"
              className="text-[#00bb93] hover:text-[#00bb93]/80 transition-colors flex items-center"
            >
              <span className="mr-2">→</span>
              Staging Environments
            </a>
          </li>
          <li>
            <a
              href="/ephemeral-environments"
              className="text-[#00bb93] hover:text-[#00bb93]/80 transition-colors flex items-center"
            >
              <span className="mr-2">→</span>
              Ephemeral Environments
            </a>
          </li>
        </ul>
      </div>
    </RootSEOPageLayout>
  );
}

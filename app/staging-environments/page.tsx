import type { Metadata } from "next";
import RootSEOPageLayout from "@/components/shared/layout/RootSEOPageLayout";

export const metadata: Metadata = {
  title: "What is a Staging Environment? | Release",
  description:
    "Learn about staging environments and why having a single staging environment may be slowing down your development process. Understand the benefits of multiple staging environments.",
  openGraph: {
    title: "What is a Staging Environment? | Release",
    description:
      "Learn about staging environments and why having a single staging environment may be slowing down your development process. Understand the benefits of multiple staging environments.",
    type: "article",
    url: "https://release.com/staging-environments",
    images: [
      {
        url: "https://release.com/og/staging-environments.png",
        width: 1200,
        height: 630,
        alt: "Staging Environments",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "What is a Staging Environment? | Release",
    description:
      "Learn about staging environments and why having a single staging environment may be slowing down your development process. Understand the benefits of multiple staging environments.",
    images: ["https://release.com/og/staging-environments.png"],
  },
  alternates: {
    canonical: "https://release.com/staging-environments",
  },
};

export default function StagingEnvironmentsPage() {
  return (
    <RootSEOPageLayout
      title="What is a Staging Environment?"
      description="Learn about staging environments and why having a single staging environment may be slowing down your development process. Understand the benefits of multiple staging environments."
    >
      <div className="text-lg text-gray-300 space-y-6">
        <p className="leading-relaxed">
          An environment, in the traditional sense, is defined as the
          surroundings in which a person, animal, or plant lives or operates.
          It's where you exist, operate and thrive. The definition of an
          environment in the computer systems context would be the surroundings
          in which code, software or applications live or operate. Or simply, an
          environment is the surroundings where your code runs.
        </p>

        <p className="leading-relaxed">
          There are many types of environments for software systems. Development
          environments, production environments, pre-production environments and
          staging environments, to name a few. All of these types of
          environments are just qualifying the purpose of the surroundings your
          code is running in. Each environment has a purpose. A development
          environment is where your code runs when you are developing your
          software. A production environment is where your code runs when it's
          in front of end users, i.e. in production.
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-6 border-b border-gray-800 pb-4">
          Staging Environment Overview
        </h2>

        <blockquote className="border-l-4 border-[#00bb93] pl-6 my-6 text-gray-300 italic text-xl">
          A staging environment (sometimes called a pre-production environment)
          is the environment where your code is 'staged' prior to being run in
          front of users so you can ensure it works as designed.
        </blockquote>

        <p className="leading-relaxed">
          A staging environment (sometimes called a pre-production environment)
          is the environment where your code is 'staged' prior to being run in
          front of users so you can ensure it works as designed. Uses of the
          staging environment can be for automated tests, or for QA teams,
          Product Managers and other stakeholders to validate features and
          functionality that have been developed according to specification.
          Staging environments are critical to building software, but building
          them is costly and time consuming so many organizations only have a
          single one.
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-6 border-b border-gray-800 pb-4">
          Most organizations have a single staging environment to their
          detriment
        </h2>

        <p className="leading-relaxed">
          Traditionally most organizations rely on a single staging environment
          for their developers. As an organization grows, this becomes a major
          bottleneck in delivering software quickly. Because developers have to
          share time on the environment, it has to be carefully maintained as
          tests finish and data is changed. The last developer on the staging
          environment may have changed it in a material way causing confusion
          and issues for the next developer to use the environment. Maintaining
          this critical resource becomes incredibly important and incredibly
          difficult as the complexity and size of an organization grows.
        </p>

        <p className="leading-relaxed">
          So why do most organizations rely on just one staging environment? The
          reason is usually unintentional if you think about the evolution of
          the development organization from the earliest days. When you have one
          or few engineers, a single staging environment is sufficient. The
          complexity of your systems are low and keeping a staging environment
          up to date is manageable.
        </p>

        <p className="leading-relaxed">
          As the organization grows and complexity increases, evolving the
          environment ecosystem becomes a tax that most organizations don't pay.
          They move fast and furious on new product features while doing their
          best to keep their infrastructure up and running. By the time product
          velocity has slowed, the complexity of their systems makes duplicating
          environments incredibly difficult. And now they're faced with an
          expensive effort to play catch up and try to remove the bottlenecks
          around a single staging environment.
        </p>

        <p className="leading-relaxed">
          The organization has two choices, invest in solving the problem or
          live with slowing product velocity. The cost to solve the problem is
          high in all scenarios. They can hire specialists to continue manually
          managing more environments or they can invest in building a platform
          to automate the creation of environments. There are tons of problems
          to solve including keeping environments in sync with production,
          ensuring data is representative of production in pre-production
          environments, automatic creation of environments, moving code from one
          environment to another, etc… Unfortunately most organizations can't
          afford to invest heavily in infrastructure so they choose to live with
          the single staging environment and just accept slowing product
          velocity.
        </p>

        <p className="leading-relaxed">
          For those companies that choose to invest in building an automated
          solution in-house they do so with the belief that building a platform
          to enable developers to move quickly will pay off in the long run. And
          for companies that have the resources to pull this off, they end up
          with a distinct competitive advantage. Companies such as Facebook,
          Google, Apple, Netflix invest heavily in infrastructure and tooling
          for this exact reason. As of this writing, Facebook has 338 open
          infrastructure roles, Google has 1072. There is a reason the big guys
          are investing here, it gives them a competitive advantage but it's
          clear it's not cheap.
        </p>

        <p className="leading-relaxed">
          What is a company to do? Invest heavily? Build internally? Buy off the
          shelf? There are solutions on the market, including Release that will
          reduce the cost dramatically. You can read more about this in our
          overview of the tradeoffs of building vs. buying a solution to staging
          environment management.
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-6 border-b border-gray-800 pb-4">
          How can you move faster with multiple staging environments?
        </h2>

        <p className="leading-relaxed">
          Higher product velocity means features can be released faster to
          customers. What benefits do you gain as an organization if you can
          enable your organization with on-demand staging environments?
        </p>

        <ul className="list-disc pl-8 mb-6 text-gray-300 space-y-2">
          <li>Higher quality software releases with less defects.</li>
          <li>
            Less frustration in your organization while waiting on shared
            resources.
          </li>
          <li>
            An advantage in time to market and experimentation against
            competitors.
          </li>
          <li>Happier customers, developers and stakeholders.</li>
          <li>No more "works on my machine".</li>
        </ul>

        <p className="leading-relaxed">
          It's no wonder the big companies invest so heavily in DevOps and
          infrastructure employees. They've built internal systems that remove
          development bottlenecks and environment scarcity.
        </p>

        <p className="leading-relaxed">
          For organizations to compete in the modern software development age,
          environment management is a critical element of any organization that
          wants to move fast. On-demand staging environments are necessary to
          unlock the potential of your teams and are the development resources
          that are most needed to deliver ideas into the world.
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-6 border-b border-gray-800 pb-4">
          Related Resources
        </h2>

        <ul className="list-none pl-0 space-y-4">
          <li>
            <a
              href="/ephemeral-environments"
              className="text-[#00bb93] hover:text-[#00bb93]/80 transition-colors flex items-center"
            >
              <span className="mr-2">→</span>
              Ephemeral Environments
            </a>
          </li>
          <li>
            <a
              href="/user-acceptance-testing-with-ephemeral-environments"
              className="text-[#00bb93] hover:text-[#00bb93]/80 transition-colors flex items-center"
            >
              <span className="mr-2">→</span>
              User Acceptance Testing with Ephemeral Environments
            </a>
          </li>
        </ul>
      </div>
    </RootSEOPageLayout>
  );
}

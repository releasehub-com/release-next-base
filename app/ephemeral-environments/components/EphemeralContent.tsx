"use client";

import RootSEOPageLayout from "@/components/shared/layout/RootSEOPageLayout";
import Link from "next/link";

export default function EphemeralContent() {
  return (
    <RootSEOPageLayout
      title="What is an Ephemeral Environment?"
      description="Learn about ephemeral environments - temporary, isolated environments for development, testing, and demos that help teams ship better software faster."
    >
      <div className="text-lg text-gray-300 space-y-6">
        <p className="leading-relaxed">
          An ephemeral environment is an environment meant to last for a limited
          amount of time, in which the definition of ephemeral is{" "}
          <em className="italic text-gray-300">lasting a very short time</em>.
          The amount of time could be as short as the lifecycle of a CI/CD
          pipeline or as long as a week, but the key component being that
          eventually the environment goes away. Some other names for ephemeral
          environments could be 'on-demand environments', 'dynamic
          environments', or 'temporary environments'. No matter the name, the
          use case is the same: the environment is created, used for a short
          period of time, and then removed without consequence.
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-6 border-b border-gray-800 pb-4">
          Ephemeral Environments Should Look Like Production
        </h2>

        <p className="leading-relaxed">
          One of the most important factors to a successful ephemeral
          environment workflow is to have the environments look as close to a
          production replica as possible. To start, if you are using Docker
          images, the same image that you deploy onto an ephemeral environment
          should be eligible to be deployed to your production server. When
          thinking about memory as one example, if the production server is
          allocated 2GB of memory then the ephemeral environment should be too.
          If the ephemeral environment has less memory, say only 1GB, and a
          memory intensive part of the application fails, it is now unclear
          whether or not that part of the application would fail if the same
          image were deployed to production.
        </p>

        <p className="leading-relaxed">
          As another slightly different example, if the application uses a
          database, the production version should be talking to a persistent
          database, like Amazon's RDS, while the ephemeral environment may be
          talking to a containerized version, but having both databases on the
          exact same version ensures new code doesn't accidentally use a
          database feature that isn't available on production.
        </p>

        <p className="leading-relaxed">
          Every application is different and we can't cover every possible
          feature that needs to look the same here, the premise remains the same
          that every ephemeral environment should look as close to your
          production environment as possible.
        </p>

        <h3 className="text-xl sm:text-2xl font-semibold text-white mt-10 mb-4">
          Ephemeral Environments Are Automated And On Demand
        </h3>

        <p className="leading-relaxed">
          Now that we know our ephemeral environments should look like our
          production environment, the next step is to automate their creation to
          meet that criteria. Products like Terraform, AWS's Cloudformation, or
          Release's Application Template are what we call "environments as code"
          to ensure that the ephemeral environments are created the same way
          each time.
        </p>

        <p className="leading-relaxed">
          Once the template is created, the ephemeral environments should be set
          up to be automatically created on certain events, such as when a pull
          request is opened. They should also be able to be created on demand
          manually (not through an event driven process) in case a new
          environment is needed for any reason.
        </p>

        <h3 className="text-xl sm:text-2xl font-semibold text-white mt-10 mb-4">
          Ephemeral Environments Have Replicated Data
        </h3>

        <p className="leading-relaxed">
          We previously mentioned that running the same version of database was
          a requirement of having our ephemeral environments look like
          production. Not only should they look the same, but they should have
          very similar datasets available to them in an isolated manner. This
          means that the database attached to the ephemeral environment will not
          be shared with any other environment. Because the database will also
          be removed as part of the cleanup process of the environment, it makes
          for the perfect place to test destructive actions without worrying
          about affecting anything else. A few ways to achieve this isolated
          replication would be to use a container with a seed file or using an
          RDS Snapshot based approach like Release's Datasets.
        </p>

        <h3 className="text-xl sm:text-2xl font-semibold text-white mt-10 mb-4">
          Ephemeral Environments Are Shareable
        </h3>

        <p className="leading-relaxed">
          Being able to see the ephemeral environment and the code changes
          yourself is great, but garnering feedback from others is even more
          important. Ephemeral environments shine when multiple stakeholders
          such as product managers, the QA team, or even customers are able to
          preview changes before they are generally available. The early
          feedback cycle helps the engineering team dial in their changes and is
          accomplished by having the ephemeral environment live on a unique and
          shareable url. At Release, every environment receives a handle in the
          form of 'ted' + 4 alphanumeric characters and each service within that
          environment has a shareable url, such as
          https://backend-teda1b2.releaseapp.io.
        </p>

        <h3 className="text-xl sm:text-2xl font-semibold text-white mt-10 mb-4">
          Integration with Collaboration Tools
        </h3>

        <p className="leading-relaxed">
          The last characteristic we talked about was being able to share the
          link to the ephemeral environment with other people. One way to
          achieve this shareability without manually sending the link to
          everyone is to set up integrations with collaboration tools such as
          Github or Jira. If the creation of the ephemeral environment is
          automated, such as when a Pull Request is opened, having an
          integration back to Github to post the shareable URL is a great way
          for other engineers to discover the environment. Github provides many
          ways to share the URL such as through comments, the status API, or
          deployments.
        </p>

        <p className="leading-relaxed">
          Another way to automate sharing the URL might be to connect to Jira
          and have a naming convention between Jira ticket numbers and branch
          names which allows the URL to be added to the ticket automatically.
          Collaboration is at the heart of using ephemeral environments and
          making it easier to discover the environments through integrations
          helps drive the team's success.
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-6 border-b border-gray-800 pb-4">
          Scaling Up With Ephemeral Environments
        </h2>

        <p className="leading-relaxed">
          Here is a fictional story of Acme, Inc., founded recently on the great
          idea of building completely customisable moose traps and selling them
          on their website. This story will illustrate how ephemeral
          environments can work for any size company, of any maturity, and with
          any workflow.
        </p>

        <p className="leading-relaxed">
          The beginning of a company starts with a pair of co-founders, an
          engineer and a product manager. The co-founders decide that using
          ephemeral environments is a good way for the engineer to showcase the
          work to the product manager and to their potential customers. The
          endeavour starts with only a few ephemeral environments as the
          engineering co-founder can only juggle so many projects at once. They
          are able to create an environment for one task and share it with the
          product manager and wait for feedback while moving onto the next task.
        </p>

        <p className="leading-relaxed">
          The company finds a few initial customers and decides to hire
          additional engineers. They also decide to set up automated ephemeral
          environments with every pull request and receive Slack messages when
          each environment is ready. The product manager is now able to review
          each product change without the need for the engineering team to send
          them the link and the number of ephemeral environments being created
          concurrently continues to grow.
        </p>

        <p className="leading-relaxed">
          After a successful year of work, the co-founders decide that they want
          to hire additional product managers and build out a QA team. With the
          added headcount, they introduce a ticketing system to track the work
          from inception to development to QA review and finally to deployment.
          To align the use of ephemeral environments throughout this process,
          the pull request and environment urls are automatically added to the
          ticket. Now the product manager and the QA team are able to use the
          same environment link on the ticket to assess the work and provide
          feedback. Nobody has to wait for an environment to be freed up for
          testing to complete their work.
        </p>

        <p className="leading-relaxed">
          After months of product polish and bootstrapping the sales process,
          the company decides to hire a sales team to kick start the customer
          acquisition process. The members of the sales team learn about the
          company's product but are also introduced to the ephemeral
          environments. When a sales team member needs to demo the product for a
          customer, they're able to create an environment with a clean dataset
          which they can use to showcase the full breadth of the product without
          worrying about questions like, "can I delete this?" and, "will
          everything be reset for my next demo?", and "will anyone mess with my
          environment while I'm trying to demonstrate it to the customer?" That
          level of confidence in their ephemeral environment allows them to
          focus on the pitch to the customer, rather than dancing around
          features because using those features might interfere with someone
          else, or worrying that there might be clutter from previous demos.
        </p>

        <p className="leading-relaxed">
          From the early stages of the company, through the growth and expansion
          of the product and engineering team, and finally to the sales and
          customer acquisition front, ephemeral environments played an important
          role each step of the way. Without these, the company may have been
          hampered by engineers waiting for time in a single staging
          environment, or product managers and the QA team testing on different
          environments and getting different results, or the sales team
          attempting to close a customer and realizing that the data on their
          environment had already been changed by a previous sales demo.
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-6 border-b border-gray-800 pb-4">
          Related Resources
        </h2>

        <ul className="list-none pl-0 space-y-4">
          <li>
            <Link
              href="/staging-environments"
              className="text-[#00bb93] hover:text-[#00bb93]/80 transition-colors flex items-center"
            >
              <span className="mr-2">→</span>
              Staging Environments
            </Link>
          </li>
          <li>
            <Link
              href="/user-acceptance-testing-with-ephemeral-environments"
              className="text-[#00bb93] hover:text-[#00bb93]/80 transition-colors flex items-center"
            >
              <span className="mr-2">→</span>
              User Acceptance Testing with Ephemeral Environments
            </Link>
          </li>
          <li>
            <Link
              href="/development-vs-staging-vs-production"
              className="text-[#00bb93] hover:text-[#00bb93]/80 transition-colors flex items-center"
            >
              <span className="mr-2">→</span>
              Development vs Staging vs Production
            </Link>
          </li>
        </ul>
      </div>
    </RootSEOPageLayout>
  );
}

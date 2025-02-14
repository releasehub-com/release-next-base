"use client";

import RootSEOPageLayout from "@/components/shared/layout/RootSEOPageLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { metadata } from "../metadata";

export default function BuildVsBuyContent() {
  return (
    <RootSEOPageLayout
      title={String(metadata.title)}
      description={String(metadata.description)}
    >
      <div className="text-lg text-gray-300 space-y-8">
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            What is a PaaS?
          </h2>
          <p className="leading-relaxed">
            A PaaS is a complete development and deployment system with
            everything you need to create sophisticated, secure, performant,
            reliable software. Platforms like AWS, GCP and Azure give you the
            systems and resources you need to create just about anything.
            Companies like CircleCI add to these platforms by allowing you to
            run tests before deploying your code to your cloud provider. But,
            neither CirlceCI or AWS can actually decipher your environment from
            your repositories and create environments for you. They leave, what
            is often the hardest part to their users (usually large devops
            teams) to figure out.
          </p>
          <p className="leading-relaxed">
            More holistic, all-in-one solutions exist like Heroku or Elastic
            Beanstalk, but these have major drawbacks. A PaaS for CI/CD needs to
            include all this functionality while being simple and intuitive to
            use.
          </p>
          <p className="leading-relaxed">
            The major cloud platforms will offer you tools and services to help
            you construct parts and pieces of your PaaS, but none of them offer
            an easy to use, integrated solution to go from code to environment.
            Other companies will market themselves as a solution for CI/CD. What
            most of these companies like CircleCI, Travis, etc don't do is the
            actual delivery. They can run your tests against a container and
            deliver the artifacts to your container registry of choice, but how
            any of that ends up in developers hands as staging environments or
            ephemeral environments or ultimately in production, is up to you.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            What do all the biggest tech companies in the world do?
          </h2>
          <p className="leading-relaxed">
            The largest technology companies in the world such as Facebook,
            Amazon, Netflix, Google, Apple, Microsoft, etc all have spent many
            millions of dollars and person-hours creating their own internal
            PaaS as they have (practically) unlimited resources and it's a
            strategic advantage. They view being able to deploy thousands of
            times a day, safely and reliably as a foundational element of their
            business.
          </p>
          <p className="leading-relaxed">
            The ability to move as fast as possible, even at their scale is one
            of their most important assets. But, for most companies the previous
            two statements are not true: you don't have unlimited resources and
            spending months or years on something unrelated to your core
            business is not a strategic advantage.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Is building a PaaS your core competency?
          </h2>
          <p className="leading-relaxed">
            Your only option before a product like Release was available was to
            hire specialists, devops engineers, to configure and develop
            software to integrate many disparate pieces of software (Spinnaker,
            Harness, Rancher, etc), using tools like Ansible with a lot of shell
            scripts. As you might imagine this is unreliable, hard to debug, and
            not something you want to be spending your limited budgets and time
            on.
          </p>
          <p className="leading-relaxed">
            In order to build a PaaS that works reliably, delivers all the
            features you need, can scale and evolve with your growing business
            you need a team of specialists. And more often than not their skills
            do not translate to your core business.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Maintenance and evolving the platform
          </h2>
          <p className="leading-relaxed">
            When deciding on Build vs Buy the upfront costs and time of these
            projects, while difficult to calculate exactly, are understood as
            important in the decision making process. One can expect to spend
            25-50% of the cost of development of your internal platform in
            maintenance once is up and running.
          </p>
          <p className="leading-relaxed">
            These two factors (maintenance and updates) will become your largest
            expenditures on a project like this after 2-3 years if you are doing
            it well. So, if it costs $500k to build your internal PaaS, expect
            to spend at least that much over 2-3 years on maintenance and
            evolving the platform, or risk having it become obsolete.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Build vs. Buy Case Studies
          </h2>

          <div className="space-y-8">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-4">
                Public Company with 200 engineers
              </h3>
              <p className="text-[#00bb93] font-semibold mb-4">
                GOAL: Release new functionality, features and products hundreds
                of times a week vs once a week.
              </p>
              <p className="leading-relaxed">
                This company decided to build an internal PaaS with an eye
                towards 100% automated testing, automatic creation of
                production-like environments on every pull request, and fast and
                easy automated deployment to production. While ultimately
                successful it took 10 dedicated resources 18 months to get the
                basic functionality working. When it was all said and done it
                was a $4-$5 million dollar project that didn't bear the fruit of
                faster more reliable deployments for 18 months.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-4">
                Fast growing startup with 40 engineers
              </h3>
              <p className="text-[#00bb93] font-semibold mb-4">
                GOAL: Leave Heroku and unify development/staging environment
                process and production
              </p>
              <p className="leading-relaxed">
                This company was using Heroku for the "Review App" feature and
                the fact they needed little devops experience to get it working.
                But, as their app became more complicated, working around
                Heroku's limitations became a large burden. They were able to
                replace Heroku and much of their CircleCI pipeline with Release
                and in a couple of weeks while retaining "Review App"
                functionality.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Conclusion
          </h2>
          <p className="leading-relaxed">
            While there are many great open source tools and toolkits to help
            you build an internal PaaS, it's not for the faint of heart or
            people concerned with their pocketbook and time. When you factor in
            needing specialized resources, an internal PaaS is orthogonal to
            your core business, cost and time required, it rarely makes sense to
            build a tool like this.
          </p>
          <p className="leading-relaxed">
            Release takes your already functioning standard development
            environments based on Docker and seamlessly and effortlessly runs
            them in the cloud. It allows you to have environments ready in
            seconds based on your developer workflows.
          </p>
        </section>

        <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700/50 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Experience the Release Difference?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Stop building infrastructure and get back to building your product.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-[#00bb93] text-white hover:bg-[#00bb93]/90"
              >
                Start Free Trial
              </Button>
            </Link>
            <Link href="/book-a-demo">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-[#00bb93] text-[#00bb93] hover:bg-[#00bb93] hover:text-white"
              >
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </RootSEOPageLayout>
  );
}

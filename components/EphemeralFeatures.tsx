import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EphemeralFeatures() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">Key Features of Release</h2>
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {[
            { title: "Automated Review Environments", description: "Generate full-stack environments for every pull request, enabling comprehensive CI and end-to-end tests." },
            { title: "Developer Empowerment", description: "Provision environments automatically upon code push using GitOps integration, providing secure, shareable links for team collaboration." },
            { title: "Remote Development Environments", description: "Offer remote development environments that can be 'mounted' to a developer's local computer, facilitating seamless development workflows." },
            { title: "Accelerated Iteration", description: "Eliminate dependencies on traditional staging deployments, allowing teams to identify and address issues earlier in the development process." },
            { title: "Cost Efficiency", description: "Provide on-demand environments that scale to zero when inactive, resulting in significant reductions in pre-production cloud costs, with savings ranging from 30-70%." },
            { title: "Instant Datasets", description: "Utilize Release's Instant Datasets to create and manage realistic datasets for testing and development, enabling data-driven testing and replication of production-like scenarios." },
          ].map((feature, index) => (
            <Card key={index} className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

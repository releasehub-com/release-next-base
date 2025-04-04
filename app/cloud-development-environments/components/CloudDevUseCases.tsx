"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Rocket, School, Clock, CheckCircle } from "lucide-react";

export default function CloudDevUseCasesComponent() {
  return (
    <section
      id="use-cases"
      className="w-full py-12 md:py-24 lg:py-32 bg-gray-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">
          Cloud Development Use Cases
        </h2>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="mr-2 h-5 w-5 text-[#00bb93]" />
                Rapid Developer Onboarding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Drastically reduce onboarding time for new developers. Get them
                up and running with a fully configured environment in minutes,
                not days.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-[#00bb93]" />
                Consistent Development Environments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Ensure all developers work in identical environments, minimizing
                "it works on my machine" issues and reducing production
                deployment errors.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="mr-2 h-5 w-5 text-[#00bb93]" />
                Enhanced Team Collaboration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Boost team productivity with shared cloud environments for
                seamless collaboration, pair programming, and code reviews.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Rocket className="mr-2 h-5 w-5 text-[#00bb93]" />
                Accelerated Prototyping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Quickly spin up environments for testing new ideas and
                prototypes without affecting production systems or local setups.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <School className="mr-2 h-5 w-5 text-[#00bb93]" />
                Streamlined Training and Workshops
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Create standardized environments for training new team members,
                conducting workshops, and facilitating learning sessions.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-12 text-center">
          <Link href="https://docs.release.com/cli/remote-dev">
            <Button
              size="lg"
              className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90"
            >
              Explore More Use Cases
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

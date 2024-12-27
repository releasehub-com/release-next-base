'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EphemeralUseCasesComponent() {
  return (
    <section id="use-cases" className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">Additional Ways to Use Release...</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white">Production Environment Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">Let Release manage production environments, enabling seamless scaling, monitoring, and deployment to ensure reliability and performance.</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white">On-Premise Solutions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">Deliver and manage on-premise solutions using Release Delivery. Simplify deployments for customers who require private or VPC-hosted infrastructure with full control and security.</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white">AI Environments with Release.ai</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">Create scalable, ephemeral environments to support machine learning workflows, model training, and AI application testing. Streamline AI/ML development and deployment.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

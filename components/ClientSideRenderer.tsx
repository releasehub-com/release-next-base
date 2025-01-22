'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const LandingPage = dynamic(() => import('@/components/LandingPage'), { ssr: false })
const GitLabLandingPage = dynamic(() => import('@/components/GitLabLandingPage'), { ssr: false })
const KubernetesLandingPage = dynamic(() => import('@/components/KubernetesLandingPage'), { ssr: false })
const ReplicatedLandingPage = dynamic(() => import('@/components/ReplicatedLandingPage').then(mod => mod.ReleaseVsReplicated), { ssr: false })
const EphemeralLanding = dynamic(() => import('@/components/EphemeralLanding').then(mod => mod.default), { ssr: false })
const CloudDevLanding = dynamic(() => import('@/components/CloudDevLanding').then(mod => mod.default), { ssr: false })

export default function ClientSideRenderer({ initialVersion }: { initialVersion: string }) {
  const [version, setVersion] = useState(initialVersion || 'ephemeral')
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    const urlVersion = searchParams.get('version')
    if (urlVersion) {
      setVersion(urlVersion)
      localStorage.setItem('landing_version', urlVersion)
    } else {
      const storedVersion = localStorage.getItem('landing_version')
      if (storedVersion) {
        setVersion(storedVersion)
      } else {
        setVersion('ephemeral')
      }
    }
    
    // Pre-load all components
    Promise.all([
      import('@/components/LandingPage'),
      import('@/components/GitLabLandingPage'),
      import('@/components/KubernetesLandingPage'),
      import('@/components/ReplicatedLandingPage'),
      import('@/components/EphemeralLanding'),
      import('@/components/CloudDevLanding')
    ]).then(() => {
      setIsLoading(false)
    })
  }, [searchParams])

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900" />
  }

  return (
    <div className="fade-in">
      {version === 'gitlab' && <GitLabLandingPage />}
      {(version === 'kubernetes' || version === 'k8s') && <KubernetesLandingPage />}
      {version === 'replicated' && <ReplicatedLandingPage />}
      {version === 'cloud-dev' && <CloudDevLanding />}
      {(version === 'ephemeral' || version === 'regular') && <EphemeralLanding />}
      {(version !== 'gitlab' && version !== 'kubernetes' && version !== 'k8s' && version !== 'replicated' && version !== 'ephemeral' && version !== 'regular' && version !== 'cloud-dev') && <LandingPage />}
    </div>
  )
}
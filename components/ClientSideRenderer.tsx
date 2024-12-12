'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const LandingPage = dynamic(() => import('@/components/LandingPage'), { ssr: false })
const GitLabLandingPage = dynamic(() => import('@/components/GitLabLandingPage'), { ssr: false })
const KubernetesLandingPage = dynamic(() => import('@/components/KubernetesLandingPage'), { ssr: false })
const ReplicatedLandingPage = dynamic(() => import('@/components/ReplicatedLandingPage').then(mod => mod.ReleaseVsReplicated), { ssr: false })

export default function ClientSideRenderer({ initialVersion }: { initialVersion: string }) {
  const [version, setVersion] = useState(initialVersion)
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
      }
    }
    
    // Pre-load all components
    Promise.all([
      import('@/components/LandingPage'),
      import('@/components/GitLabLandingPage'),
      import('@/components/KubernetesLandingPage'),
      import('@/components/ReplicatedLandingPage')
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
      {(version !== 'gitlab' && version !== 'kubernetes' && version !== 'k8s' && version !== 'replicated') && <LandingPage />}
    </div>
  )
}

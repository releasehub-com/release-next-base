'use client'

import { useEffect, useState, ComponentType } from 'react'

type LandingWrapperProps = {
  initialVersion: string | undefined
  LandingPage: ComponentType
  GitLabLandingPage: ComponentType
  KubernetesLandingPage: ComponentType
  ReplicatedLandingPage: ComponentType
  EphemeralLanding: ComponentType
}

export default function LandingWrapper({ 
  initialVersion,
  LandingPage,
  GitLabLandingPage,
  KubernetesLandingPage,
  ReplicatedLandingPage,
  EphemeralLanding
}: LandingWrapperProps) {
  const [CurrentComponent, setCurrentComponent] = useState<ComponentType | null>(() => {
    if (initialVersion === 'gitlab' && GitLabLandingPage) return GitLabLandingPage
    if (initialVersion === 'k8s' && KubernetesLandingPage) return KubernetesLandingPage
    if (initialVersion === 'replicated' && ReplicatedLandingPage) return ReplicatedLandingPage
    if (initialVersion === 'ephemeral' && EphemeralLanding) return EphemeralLanding
    return LandingPage || null
  })

  useEffect(() => {
    const getStoredVersion = () => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('landing_version')
      }
      return null
    }

    const storedVersion = getStoredVersion()
    const version = initialVersion || storedVersion || 'regular'

    let newComponent: ComponentType | null = null

    switch (version) {
      case 'gitlab':
        newComponent = GitLabLandingPage || null
        break
      case 'k8s':
        newComponent = KubernetesLandingPage || null
        break
      case 'replicated':
        newComponent = ReplicatedLandingPage || null
        break
      case 'ephemeral':
        newComponent = EphemeralLanding || null
        break
      default:
        newComponent = LandingPage || null
    }

    if (newComponent && newComponent !== CurrentComponent) {
      setCurrentComponent(newComponent)
    }

    if (typeof window !== 'undefined') {
      if (version === 'regular') {
        localStorage.removeItem('landing_version')
      } else {
        localStorage.setItem('landing_version', version)
      }
    }
  }, [initialVersion, LandingPage, GitLabLandingPage, KubernetesLandingPage, ReplicatedLandingPage, EphemeralLanding, CurrentComponent])

  if (!CurrentComponent) {
    return <div>Loading...</div>
  }

  return <CurrentComponent />
}

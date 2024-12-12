import { redirect } from 'next/navigation'
import { EnhancedComparisonPage } from '@/components/EnhancedComparisonPage'
import { gitlabFeatures } from '../gitlab/features'
import { signadotFeatures } from '../signadot/features'
import { bunnyshellFeatures } from '../bunnyshell/features'
import { qoveryFeatures } from '../qovery/features'
import { shipyardFeatures } from '../shipyard/features'

type CompetitorData = {
  name: string;
  features: {
    name: string;
    release: boolean;
    competitor: boolean;
    description: string;
  }[];
};

const competitorMap: Record<string, CompetitorData> = {
  gitlab: { name: 'GitLab', features: gitlabFeatures },
  signadot: { name: 'Signadot', features: signadotFeatures },
  bunnyshell: { name: 'Bunnyshell', features: bunnyshellFeatures },
  qovery: { name: 'Qovery', features: qoveryFeatures },
  quovery: { name: 'Qovery', features: qoveryFeatures },
  shipyard: { name: 'Shipyard', features: shipyardFeatures },
}

export default function ComparisonPage({ params }: { params: { slug: string[] } }) {
  const competitor = params.slug[0]?.split('.')[0].toLowerCase()
  const competitorData = competitorMap[competitor as keyof typeof competitorMap]

  if (!competitorData) {
    redirect('/comparison')
  }

  return (
    <EnhancedComparisonPage
      competitorName={competitorData.name}
      features={competitorData.features}
    />
  )
}

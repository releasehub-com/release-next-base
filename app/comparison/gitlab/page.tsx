import { EnhancedComparisonPage } from '@/components/EnhancedComparisonPage'
import { gitlabFeatures } from './features'

export default function GitLabComparison() {
  return <EnhancedComparisonPage competitorName="GitLab" features={gitlabFeatures} />
}

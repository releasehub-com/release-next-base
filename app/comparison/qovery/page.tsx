import { EnhancedComparisonPage } from '@/components/EnhancedComparisonPage'
import { qoveryFeatures } from './features'

export default function QoveryComparison() {
  return <EnhancedComparisonPage competitorName="Qovery" features={qoveryFeatures} />
}

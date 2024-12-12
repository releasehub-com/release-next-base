import { EnhancedComparisonPage } from '@/components/EnhancedComparisonPage'
import { shipyardFeatures } from './features'

export default function ShipyardComparison() {
  return <EnhancedComparisonPage competitorName="Shipyard" features={shipyardFeatures} />
}

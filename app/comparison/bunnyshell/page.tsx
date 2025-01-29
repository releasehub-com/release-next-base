import { EnhancedComparisonPage } from "@/components/EnhancedComparisonPage";
import { bunnyshellFeatures } from "./features";

export default function BunnyshellComparison() {
  return (
    <EnhancedComparisonPage
      competitorName="Bunnyshell"
      features={bunnyshellFeatures}
    />
  );
}

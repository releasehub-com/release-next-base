import { EnhancedComparisonPage } from "@/components/EnhancedComparisonPage";
import { signadotFeatures } from "./features";

export default function SignadotComparison() {
  return (
    <EnhancedComparisonPage
      competitorName="Signadot"
      features={signadotFeatures}
    />
  );
}

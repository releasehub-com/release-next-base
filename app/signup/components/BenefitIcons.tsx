import {
  Clock,
  TestTube2,
  Code2,
  Zap,
  Expand,
  Users,
  Box,
  Workflow,
  Shield,
  GitBranch,
  Maximize2,
  Cloud,
  type LucideIcon,
} from "lucide-react";

interface BenefitIconsProps {
  icon: string;
  className?: string;
}

export function BenefitIcons({
  icon,
  className = "w-12 h-12 text-white",
}: BenefitIconsProps) {
  const icons: Record<string, LucideIcon> = {
    // Cost & Performance Icons
    "cost-reduction": Clock,
    testing: TestTube2,
    developer: Code2,
    performance: Zap,

    // Cloud Development Icons
    "cloud-power": Zap,
    ide: Code2,
    collaboration: Users,

    // Kubernetes Icons
    kubernetes: Box,
    automation: Workflow,
    security: Shield,

    // GitLab Icons
    gitlab: GitBranch,
    pipeline: Workflow,

    // Cloud Platform Icons
    git: GitBranch,
    scale: Maximize2,
    "cloud-provider": Cloud,
  };

  const IconComponent = icons[icon];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={className} />;
}

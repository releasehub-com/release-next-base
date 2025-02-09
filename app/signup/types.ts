export interface BenefitType {
  icon: string;
  title: string;
  description: string;
}

export interface ContentType {
  title: string;
  benefits: readonly BenefitType[];
  steps: readonly string[];
}

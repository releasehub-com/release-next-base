export interface PartnerFrontmatter {
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  mainImage?: string;
  featureImage?: string;
  buttonCopy?: string;
  buttonLink?: string;
  externalLink?: string;
  featureTitle?: string;
  featureList?: string;
  betterTitle?: string;
  betterDescription?: string;
  betterCards?: string[];
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonCopy?: string;
  publishDate: string;
}

export interface Partner {
  slug: string;
  name: string;
  title: string;
  description: string;
  logo: string;
  category: string;
  content?: string;
  publishDate?: string;
  externalLink?: string;
  thumbnail?: string;
  mainImage?: string;
  featureImage?: string;
  buttonCopy?: string;
  buttonLink?: string;
  featureTitle?: string;
  featureList?: string;
  betterTitle?: string;
  betterDescription?: string;
  betterCards?: string[];
}

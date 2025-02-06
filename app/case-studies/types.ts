export interface CaseStudyFrontmatter {
  title: string;
  description: string;
  publishDate: string;
  logo: string;
  thumbnail: string;
  companySize?: string;
  industry?: string;
  location?: string;
  developmentVelocity?: string;
  developerExperience?: string;
  leanOperations?: string;
}

export interface CaseStudy {
  slug: string;
  frontmatter: CaseStudyFrontmatter;
}

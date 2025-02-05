export interface BlogPosting {
  "@context": "https://schema.org";
  "@type": "BlogPosting";
  headline: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: {
    "@type": "Person";
    name: string;
  };
  publisher?: {
    "@type": "Organization";
    name: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
    };
  };
}

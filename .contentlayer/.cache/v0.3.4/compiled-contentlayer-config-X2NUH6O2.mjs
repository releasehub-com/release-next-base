// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
var BlogPost = defineDocumentType(() => ({
  name: "BlogPost",
  filePathPattern: `**/blog/posts/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    summary: { type: "string", required: true },
    publishDate: { type: "string", required: true },
    author: { type: "string", required: true },
    readingTime: { type: "number", required: true },
    categories: { type: "list", of: { type: "string" }, required: true },
    mainImage: { type: "string", required: true },
    imageAlt: { type: "string", required: true },
    showCTA: { type: "boolean", required: true },
    ctaCopy: { type: "string", required: false },
    ctaLink: { type: "string", required: false },
    relatedPosts: { type: "list", of: { type: "string" }, required: true },
    ogImage: { type: "string", required: true },
    excerpt: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" }, required: true },
    ctaButton: { type: "string", required: false },
    date: { type: "string", required: false },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (post) => post._raw.flattenedPath.replace(/blog\/posts\//, ""),
    },
    url: {
      type: "string",
      resolve: (post) =>
        `/blog/${post._raw.flattenedPath.replace(/blog\/posts\//, "")}`,
    },
  },
}));
var CaseStudy = defineDocumentType(() => ({
  name: "CaseStudy",
  filePathPattern: "case-studies/content/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    summary: { type: "string", required: false },
    logo: { type: "string", required: false },
    logoAlt: { type: "string", required: false },
    description: { type: "string", required: false },
    publishDate: { type: "date", required: false },
    thumbnail: { type: "string", required: false },
    companySize: { type: "string", required: false },
    industry: { type: "string", required: false },
    location: { type: "string", required: false },
    developmentVelocity: { type: "string", required: false },
    developerExperience: { type: "string", required: false },
    leanOperations: { type: "string", required: false },
  },
  computedFields: {
    computedSlug: {
      type: "string",
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, ""),
    },
  },
}));
var Legal = defineDocumentType(() => ({
  name: "Legal",
  filePathPattern: `**/legal/content/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    publishDate: { type: "string", required: false },
    slug: { type: "string", required: false },
  },
  computedFields: {
    computedSlug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace(/legal\/content\//, ""),
    },
  },
}));
var Partner = defineDocumentType(() => ({
  name: "Partner",
  filePathPattern: "partners/content/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    summary: { type: "string", required: false },
    logo: { type: "string", required: false },
    logoAlt: { type: "string", required: false },
    slug: { type: "string", required: false },
    description: { type: "string", required: false },
    category: { type: "string", required: false },
    thumbnail: { type: "string", required: false },
    mainImage: { type: "string", required: false },
    featureImage: { type: "string", required: false },
    buttonCopy: { type: "string", required: false },
    buttonLink: { type: "string", required: false },
    featureTitle: { type: "string", required: false },
    featureList: { type: "string", required: false },
    betterTitle: { type: "string", required: false },
    betterDescription: { type: "string", required: false },
    betterCards: { type: "list", of: { type: "string" }, required: false },
    publishDate: { type: "date", required: false },
  },
  computedFields: {
    computedSlug: {
      type: "string",
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, ""),
    },
  },
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "app",
  documentTypes: [BlogPost, CaseStudy, Legal, Partner],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["anchor"],
          },
        },
      ],
    ],
  },
});
export {
  BlogPost,
  CaseStudy,
  Legal,
  Partner,
  contentlayer_config_default as default,
};
//# sourceMappingURL=compiled-contentlayer-config-X2NUH6O2.mjs.map

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Partner } from "./types";

const partnersDirectory = path.join(process.cwd(), "app/partners/content");

export function getPartners(): Partner[] {
  const fileNames = fs.readdirSync(partnersDirectory);

  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const fullPath = path.join(partnersDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug: data.slug,
        name: data.title,
        title: data.title,
        description: data.description,
        logo: data.thumbnail,
        category: data.category,
        mainImage: data.mainImage,
        featureImage: data.featureImage,
        buttonCopy: data.buttonCopy,
        buttonLink: data.buttonLink,
        externalLink: data.externalLink,
        featureTitle: data.featureTitle,
        featureList: data.featureList,
        betterTitle: data.betterTitle,
        betterDescription: data.betterDescription,
        betterCards: data.betterCards,
        publishDate: data.publishDate,
      };
    })
    .sort((a, b) => {
      const dateA = new Date(a.publishDate || 0).getTime();
      const dateB = new Date(b.publishDate || 0).getTime();
      return dateB - dateA;
    });
}

export function getPartnerBySlug(slug: string): Partner | undefined {
  try {
    const partners = getPartners();
    const partner = partners.find((p) => p.slug === slug);
    if (!partner) return undefined;

    const files = fs.readdirSync(partnersDirectory);
    const file = files.find((f) => {
      const content = fs.readFileSync(path.join(partnersDirectory, f), "utf8");
      const { data } = matter(content);
      return data.slug === slug;
    });

    if (!file) return undefined;

    const fullPath = path.join(partnersDirectory, file);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug: data.slug,
      name: data.title,
      title: data.title,
      description: data.description,
      logo: data.thumbnail,
      category: data.category,
      content,
      mainImage: data.mainImage,
      featureImage: data.featureImage,
      buttonCopy: data.buttonCopy,
      buttonLink: data.buttonLink,
      externalLink: data.externalLink,
      featureTitle: data.featureTitle,
      featureList: data.featureList,
      betterTitle: data.betterTitle,
      betterDescription: data.betterDescription,
      betterCards: data.betterCards,
      publishDate: data.publishDate,
    };
  } catch (error) {
    console.error("Error in getPartnerBySlug:", error);
    return undefined;
  }
}

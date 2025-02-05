import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface MDXImageProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  src: string;
  alt: string;
}

export interface MDXHeadingProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  > {
  children: React.ReactNode;
}

export interface MDXParagraphProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {
  children: React.ReactNode;
}

export interface MDXLinkProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  href?: string;
  children: React.ReactNode;
}

export interface MDXPreProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement> {
  children: React.ReactNode;
}

export interface MDXCodeProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  children: React.ReactNode;
}

export interface MDXUnorderedListProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  > {
  children: React.ReactNode;
}

export interface MDXOrderedListProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLOListElement>,
    HTMLOListElement
  > {
  children: React.ReactNode;
}

export interface MDXListItemProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  children: React.ReactNode;
}

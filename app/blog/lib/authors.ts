interface Author {
  name: string;
  image: string;
  title?: string;
  twitter?: string;
  linkedin?: string;
}

export const authors: Record<string, Author> = {
  "andrew-colombi": {
    name: "Andrew Colombi",
    image: "/authors/andrew-colombi.png",
  },
  "david-giffin": {
    name: "David Giffin",
    image: "/authors/david-giffin.jpg",
    title: "Co-founder",
    linkedin: "davidgiffin",
  },
  "erik-landerholm": {
    name: "Erik Landerholm",
    image: "/authors/erik-landerholm.jpg",
    title: "CTO & Co-founder",
    twitter: "@eriklanderholm",
    linkedin: "eriklanderholm",
  },
  "ira-casteel": {
    name: "Ira Casteel",
    image: "/authors/ira-casteel.png",
  },
  "jeremy-kreutzbender": {
    name: "Jeremy Kreutzbender",
    image: "/authors/jeremy-kreutzbender.jpg",
  },
  "jon-burns": {
    name: "Jon Burns",
    image: "/authors/jon-burns.jpeg",
  },
  "kelsey-chamness": {
    name: "Kelsey Chamness",
    image: "/authors/kelsey-chamness.png",
  },
  "kevin-luu": {
    name: "Kevin Luu",
    image: "/authors/kevin-luu.jpg",
  },
  "luiz-felipe": {
    name: "Luiz Felipe",
    image: "/authors/luiz-felipe.jpeg",
  },
  "matt-werber": {
    name: "Matt Werber",
    image: "/authors/matt-werber.jpg",
  },
  "matt-carter": {
    name: "Matt Carter",
    image: "/authors/matt-carter.jpg",
  },
  "nick-busey": {
    name: "Nick Busey",
    image: "/authors/nick-busey.jpg",
  },
  "tommy-mcclung": {
    name: "Tommy McClung",
    image: "/authors/tommy-mcclung.jpg",
    title: "CEO & Co-founder",
    twitter: "@tommy_mcclung",
    linkedin: "tommymcclung",
  },
  "dawid-ziolkowski": {
    name: "Dawid Ziolkowski",
    image: "/authors/default-avatar.jpg",
  },
  "sam-allen": {
    name: "Sam Allen",
    image: "/authors/sam-allen.jpg",
  },
  "josh-dirkx": {
    name: "Josh Dirkx",
    image: "/authors/default-avatar.jpg",
  },
  "regis-wilson": {
    name: "Regis Wilson",
    image: "/authors/regis-wilson.png",
  },
  "michael-harrison": {
    name: "Michael Harrison",
    image: "/authors/default-avatar.jpg",
  },
  "james-quigley": {
    name: "James Quigley",
    image: "/authors/default-avatar.jpg",
  },
  default: {
    name: "Release Team",
    image: "/authors/default-avatar.jpg",
  },
};

export function getAuthorInfo(authorId: string): Author {
  return authors[authorId] || authors["default"];
}

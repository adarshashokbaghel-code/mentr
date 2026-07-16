export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; title: string; text: string };

export type ArticleSection = {
  heading: string;
  blocks: ArticleBlock[];
};

export type ArticleFaq = {
  question: string;
  answer: string;
};

export type ArticleContent = {
  slug: string;
  publishedAt: string;
  updatedAt: string;
  readTimeMinutes: number;
  author: string;
  intro: string;
  sections: ArticleSection[];
  faqs: ArticleFaq[];
  relatedLinks: { label: string; href: string }[];
};

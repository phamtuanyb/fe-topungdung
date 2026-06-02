export type NewsCategoryKey = string;

export type NewsTagVariant = "blue" | "orange" | "teal" | "gray";

export type NewsServiceIconVariant = "blue" | "orange" | "teal" | "purple";

export type NewsCategory = {
  key: NewsCategoryKey;
  label: string;
  count: number;
}

export type NewsArticle = {
  id: number;
  cat: string;
  tag: string;
  tagVariant: NewsTagVariant;
  title: string;
  excerpt: string;
  date: string;
  img: string;
  imgAlt: string;
  slug: string;
  readingTime?: number; // số phút đọc ước tính
}

export type NewsService = {
  icon: string;
  label: string;
  sub: string;
  href: string;
  iconVariant: NewsServiceIconVariant;
}
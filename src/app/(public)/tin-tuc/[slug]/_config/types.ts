export interface ArticleMeta {
  date: string;
  author: string;
  readTime: string;
}

export interface Tag {
  label: string;
  href: string;
}

export interface Author {
  avatar: string;
  name: string;
  role: string;
  bio: string;
}

export interface RelatedArticle {
  id: number;
  href: string;
  img: string;
  imgAlt: string;
  cat: string;
  title: string;
}

export interface SidebarCategoryItem {
  label: string;
  count: number;
  href: string;
  active?: boolean;
}

export interface SidebarServiceItem {
  icon: string;
  label: string;
  sub: string;
  href: string;
  iconVariant: "blue" | "orange" | "teal" | "purple";
}

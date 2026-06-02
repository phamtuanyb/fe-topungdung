import type { ArticleMeta, Author, RelatedArticle, SidebarCategoryItem, SidebarServiceItem, Tag } from "./types";

export const ARTICLE_META: ArticleMeta = {
  date: "19/05/2026",
  author: "Đội ngũ Vsoftware",
  readTime: "7 phút đọc",
};

export const ARTICLE_TAGS: Tag[] = [
  { label: "CRM", href: "/tin-tuc" },
  { label: "Phần mềm SME", href: "/tin-tuc" },
  { label: "Bán hàng", href: "/tin-tuc" },
  { label: "Số hóa", href: "/tin-tuc" },
  { label: "Excel", href: "/tin-tuc" },
];

export const ARTICLE_AUTHOR: Author = {
  avatar: "👨‍💻",
  name: "Đội ngũ Vsoftware",
  role: "Product & Content Team",
  bio: "Chúng tôi xây phần mềm cho hàng trăm SME Việt Nam — và viết từ trải nghiệm thực chiến, không phải lý thuyết suông. Mỗi bài viết là bài học từ một dự án thật.",
};

export const RELATED_ARTICLES: RelatedArticle[] = [
  {
    id: 1,
    href: "/tin-tuc/bai-viet",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=338&q=80",
    imgAlt: "Sales management",
    cat: "CRM & Phần mềm",
    title: "App quản lý bán hàng vs Excel: khi nào nên chuyển đổi?",
  },
  {
    id: 2,
    href: "/tin-tuc/bai-viet",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&h=338&q=80",
    imgAlt: "Digital transformation",
    cat: "Số hóa SME",
    title: "Lộ trình số hóa cho doanh nghiệp 10-50 người: bắt đầu từ đâu?",
  },
  {
    id: 3,
    href: "/tin-tuc/bai-viet",
    img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&h=338&q=80",
    imgAlt: "ROI calculation",
    cat: "Chia sẻ kinh nghiệm",
    title: "Cách tính ROI phần mềm tùy chỉnh — không phải con số đẹp, mà là con số thật",
  },
];

export const SIDEBAR_CATEGORIES: SidebarCategoryItem[] = [
  { label: "Tất cả bài viết", count: 9, href: "/tin-tuc" },
  { label: "CRM & Phần mềm", count: 3, href: "/tin-tuc", active: true },
  { label: "Số hóa SME", count: 2, href: "/tin-tuc" },
  { label: "Công nghệ", count: 2, href: "/tin-tuc" },
  { label: "Chia sẻ kinh nghiệm", count: 2, href: "/tin-tuc" },
];

export const SIDEBAR_SERVICES: SidebarServiceItem[] = [
  { icon: "👥", label: "CRM cho SME", sub: "Lead, pipeline, dự báo doanh số", href: "/dich-vu/crm-cho-sme", iconVariant: "blue" },
  { icon: "📦", label: "Quản lý kho WMS", sub: "Tồn kho realtime, cảnh báo hết hàng", href: "/dich-vu/quan-ly-kho", iconVariant: "orange" },
  { icon: "🤖", label: "AI & Automation", sub: "Chatbot, workflow tự động hóa", href: "/dich-vu/ai-automation", iconVariant: "teal" },
  { icon: "🌐", label: "Website & Landing Page", sub: "SEO ready, tích hợp CRM", href: "/dich-vu/website-landing", iconVariant: "purple" },
];

export const SVC_ICON_BG: Record<SidebarServiceItem["iconVariant"], string> = {
  blue: "bg-[#1E5BC6]",
  orange: "bg-[#F47920]",
  teal: "bg-teal-600",
  purple: "bg-violet-600",
};

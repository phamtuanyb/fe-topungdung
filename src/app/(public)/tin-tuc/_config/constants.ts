import { NewsCategory, NewsService, NewsServiceIconVariant, NewsTagVariant } from "./types";

export const NEWS_TAG_STYLES: Record<NewsTagVariant, string> = {
  blue: "text-[#1E5BC6] bg-[#EBF1FB]",
  orange: "text-[#D96510] bg-[#FEF3E8]",
  teal: "text-teal-600 bg-teal-50",
  gray: "text-gray-500 bg-gray-100",
};

export const NEWS_SVC_ICON_BG: Record<NewsServiceIconVariant, string> = {
  blue: "bg-[#1E5BC6]",
  orange: "bg-[#F47920]",
  teal: "bg-teal-600",
  purple: "bg-violet-600",
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────────
export const CATEGORIES: NewsCategory[] = [
  { key: "all", label: "Tất cả", count: 9 },
  { key: "crm", label: "CRM & Phần mềm", count: 3 },
  { key: "sohoa", label: "Số hóa SME", count: 2 },
  { key: "congnghe", label: "Công nghệ", count: 2 },
  { key: "kinhnghiem", label: "Chia sẻ kinh nghiệm", count: 2 },
];

export  const SERVICES: NewsService[] = [
  { icon: "💻", label: "Phần mềm CRM", sub: "Quản lý khách hàng & bán hàng", iconVariant: "blue", href: "/dich-vu/crm-cho-sme" },
  { icon: "📊", label: "App quản lý kho", sub: "Kiểm soát tồn kho thời gian thực", iconVariant: "orange", href: "/dich-vu/quan-ly-kho" },
  { icon: "📱", label: "App nội bộ", sub: "Checklist, báo cáo, quy trình", iconVariant: "teal", href: "/dich-vu/app-ban-hang" },
  { icon: "🌐", label: "Website & Landing Page", sub: "Chuyển đổi cao, tải nhanh", iconVariant: "purple", href: "/dich-vu/website-landing" },
];
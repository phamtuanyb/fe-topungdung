import type { Metadata } from 'next';
import AiAgentSection from './_components/AiAgentSection';
import BlogSection from './_components/BlogSection';
import CtaSection from './_components/CtaSection';
import HighlightsCarousel from './_components/HighlightsCarousel';
import HowItWorksSection from './_components/HowItWorksSection';
import PainPointsSection from './_components/PainPointsSection';
import PricingSection from './_components/PricingSection';
import {
    HeroSection,
} from './_components/Sections';
import ServicesSection from './_components/ServicesSection';
import ShowcaseTabs from './_components/ShowcaseTabs';
import WhySection from './_components/WhySection';
import { getCategories, getCategoryPosts, getCommitmentsConfig, getHomepageConfig, getPosts } from '@/lib/api/public';
import { AI_AGENT_SLUGS } from '@/constants/app.constants';
import type { CommitmentsConfig, HomepageConfig } from '@/types';
import CommitmentsSection from './_components/CommitmentsSection';

export const metadata: Metadata = {
  title: 'Vsoftware — Phần mềm theo yêu cầu cho SMEs Việt Nam',
  description:
    'Vsoftware xây dựng phần mềm quản lý theo yêu cầu cho doanh nghiệp vừa và nhỏ: CRM, App Mobile, AI Agent & Automation. Triển khai 4–8 tuần, bảo hành 12 tháng.',
}

export default async function HomePage() {

  const aiPosts = await getCategoryPosts(AI_AGENT_SLUGS, { limit: 50 }).catch(() => ({ data: [] }));

  const [categories, posts, homepageRes, commitRes] = await Promise.all([
    getCategories().catch(() => ({ data: [] })),
    getPosts({ limit: 100 }).catch(() => ({ data: [] })),
    getHomepageConfig().catch(() => ({ data: null as HomepageConfig | null })),
    getCommitmentsConfig().catch(() => ({ data: null as CommitmentsConfig | null })),
  ]);

  const hp = homepageRes.data;
  const commitments = commitRes.data;

  // Ẩn section khi admin tick "hidden" trong /admin/homepage.
  // Mặc định (chưa có config) → hiện hết.
  const show = (s?: { hidden?: boolean } | null) => !s?.hidden

  return (
    <>
      {show(hp?.hero) && <HeroSection config={hp?.hero} />}
      {show(hp?.painPoints) && <PainPointsSection config={hp?.painPoints} />}
      {show(hp?.services) && <ServicesSection categories={categories.data} posts={posts.data} config={hp?.services} />}
      {show(hp?.aiAgent) && <AiAgentSection aiPosts={aiPosts.data} config={hp?.aiAgent} />}
      {show(hp?.howItWorks) && <HowItWorksSection config={hp?.howItWorks} />}
      {show(hp?.why) && <WhySection config={hp?.why} />}
      {show(hp?.showcase) && <ShowcaseTabs config={hp?.showcase} />}
      {show(hp?.pricing) && <PricingSection config={hp?.pricing} />}
      <CommitmentsSection config={commitments} />
      {show(hp?.highlights) && <HighlightsCarousel config={hp?.highlights} />}
      {show(hp?.blog) && <BlogSection config={hp?.blog} />}
      {show(hp?.cta) && <CtaSection config={hp?.cta} />}
    </>
  )
}
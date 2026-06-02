import { getCategories, getCategoryPosts, getNavMenu } from '@/lib/api/public'
import { AI_AGENT_SLUGS, SERVICES_SLUGS, NEWS_SLUGS } from '@/constants/app.constants'
import HeaderClient from './HeaderClient'
import type { Category } from '@/types'

const Header = async () => {
  const [menuRes, aiAgentRes, servicesRes, newsRes, categoriesRes] = await Promise.all([
    getNavMenu().catch(() => ({ data: null })),
    getCategoryPosts(AI_AGENT_SLUGS, { limit: 100 }).catch(() => ({ data: [] })),
    getCategoryPosts(SERVICES_SLUGS, { limit: 100 }).catch(() => ({ data: [] })),
    getCategoryPosts(NEWS_SLUGS, { limit: 8 }).catch(() => ({ data: [] })),
    getCategories().catch(() => ({ data: [] as Category[] })),
  ])
  const menuData = menuRes?.data?.items ?? []
  const aiAgentPosts = aiAgentRes?.data ?? []
  const servicesPosts = servicesRes?.data ?? []
  const newsPosts = newsRes?.data ?? []

  // Sub-categories của "Tin tức"
  const allCats = categoriesRes?.data ?? []
  const tinTucCat = allCats.find((c) => c.slug === NEWS_SLUGS)
  const newsSubCategories =
    tinTucCat?.children && tinTucCat.children.length > 0
      ? tinTucCat.children
      : allCats.filter((c) => c.parentId === tinTucCat?.id)

  return (
    <HeaderClient
      menuData={menuData}
      aiAgentPosts={aiAgentPosts}
      servicesPosts={servicesPosts}
      newsPosts={newsPosts}
      newsSubCategories={newsSubCategories}
    />
  )
}

export default Header

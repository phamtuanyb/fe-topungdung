import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeroProps {
  title: string
  titleEm?: string
  breadcrumbs: BreadcrumbItem[]
  titleTag?: 'h1' | 'div'
}

const PageHero = ({ title, titleEm, breadcrumbs, titleTag = 'h1' }: PageHeroProps) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vsoftware.vn'

  // Build title with optional em highlight
  const renderTitle = () => {
    if (!titleEm) return title
    const parts = title.split(titleEm)

    return (
      <>
        {parts[0]}<em className="not-italic text-vs-orange">{titleEm}</em>{parts[1]}
      </>
    )
  }

  const HeadingTag = titleTag

  // Generate breadcrumb structured data for SEO
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((crumb, index) => {
      const itemUrl = crumb.href
        ? crumb.href.startsWith('http')
          ? crumb.href
          : `${siteUrl}${crumb.href}`
        : undefined

      return {
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.label,
        ...(itemUrl ? { 'item': itemUrl } : {}),
      }
    }),
  }

  return (
    <div className="bg-vs-dark-gradient py-[13px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <div className="container mx-auto px-6 flex items-center justify-between gap-6">
        <HeadingTag className="text-[18px] font-extrabold text-white uppercase leading-none m-0 whitespace-nowrap">
          {renderTitle()}
        </HeadingTag>
        <nav className="flex items-center gap-2 text-[12px] text-white/50 flex-shrink-0 flex-wrap">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-white/25">›</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="text-white/50 hover:text-white transition-colors no-underline">{crumb.label}</Link>
              ) : (
                <span>{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default PageHero
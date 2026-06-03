import { getCategoryPosts, getCommitmentsConfig, getHomepageConfig, getPost } from '@/lib/api/public'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { SERVICES_SLUGS, SERVICES_URL } from '@/constants/app.constants'
import { DynamicIcon } from '@/components/admin/IconPicker'
import type { ProductPageConfig, Post, CommitmentsConfig, HomepageConfig } from '@/types'
import StickyBottomBar from '@/app/(public)/ai-agent/[slug]/_components/StickyBottomBar'
import TestimonialsCarousel from '@/app/(public)/ai-agent/[slug]/_components/TestimonialsCarousel'
import CtaSection from '@/app/(public)/_components/CtaSection'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const svc = await getPost(params.slug).then(res => res.data).catch(() => null)
  if (!svc) return { title: 'Không tìm thấy' }
  return {
    title: svc.seoTitle || svc.title,
    description: svc.seoDescription || svc.excerpt,
    alternates: { canonical: `/dich-vu/${params.slug}` },
  }
}

// Trang sản phẩm dịch vụ fetch data realtime từ BE — không SSG.
// `force-dynamic` ngăn Next.js prerender ở build time, tránh lỗi static-to-dynamic.
export const dynamic = 'force-dynamic'

const has = <T,>(x: T | null | undefined): x is T => x !== null && x !== undefined && (typeof x !== 'string' || x.length > 0)

function ytEmbedUrl(url: string): string | null {
  if (!url) return null
  if (url.includes('/embed/')) return url
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([\w-]{6,})/)
  if (m) return `https://www.youtube.com/embed/${m[1]}`
  return null
}

function parsePrice(s?: string): number | null {
  if (!s) return null
  const digits = s.replace(/[^\d]/g, '')
  return digits ? parseInt(digits, 10) : null
}

function calcDiscount(original?: string, price?: string): number | null {
  const o = parsePrice(original)
  const p = parsePrice(price)
  if (!o || !p || o <= p) return null
  return Math.round(((o - p) / o) * 100)
}

export default async function ServicePage({ params }: Props) {
  const svc: Post | null = await getPost(params.slug).then(res => res.data).catch(() => null)
  if (!svc) notFound()

  const cfg: ProductPageConfig = svc.productPageConfig ?? {}

  const [relatedRes, commitRes, hpRes] = await Promise.all([
    getCategoryPosts(SERVICES_SLUGS, { page: 1, limit: 8 }).catch(() => null),
    getCommitmentsConfig().catch(() => ({ data: null as CommitmentsConfig | null })),
    getHomepageConfig().catch(() => ({ data: null as HomepageConfig | null })),
  ])
  const related = (relatedRes?.data ?? [])
    .filter((p) => p.slug !== params.slug)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .slice(0, 3)
  const sharedCommitments = commitRes.data
  const sharedCta = hpRes.data?.cta

  const hero = cfg.hero
  const demo = cfg.demo
  const pain = cfg.painPoints
  const sol = cfg.solutions
  const feat = cfg.features
  const price = cfg.pricing
  const com = sharedCommitments
  const test = cfg.testimonials
  const faq = cfg.faq
  const trust = cfg.trustStrip
  const sticky = cfg.stickyBottom

  const featuredPlan = price?.plans.find((p) => p.featured) ?? price?.plans[0]

  return (
    <>
      {/* ── HERO BANNER ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {has(hero?.heroImageSrc) ? (
          <Image
            src={hero!.heroImageSrc!}
            alt={hero!.heroImageAlt ?? svc.title}
            fill
            unoptimized
            priority
            className="object-cover -z-10"
          />
        ) : (
          <div className="absolute inset-0 -z-10 bg-vs-hero" />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white/95 via-white/80 to-white/10" />

        <div className="max-w-8xl mx-auto px-6 py-10 lg:py-14 min-h-[440px] flex flex-col justify-center">
          <nav className="text-[12px] text-vs-gray-600 mb-6">
            <Link href="/" className="hover:text-vs-blue">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link href={`/${SERVICES_URL}`} className="hover:text-vs-blue">Dịch vụ</Link>
            <span className="mx-2">/</span>
            <span className="text-vs-dark">{svc.title}</span>
          </nav>

          <div className="max-w-2xl">
            {svc.badge && (
              <span className="inline-flex items-center text-[11px] font-extrabold uppercase tracking-wider bg-vs-orange text-white px-2.5 py-1 rounded-full mb-4">
                {svc.badge}
              </span>
            )}
            <h1 className="text-[clamp(28px,4vw,48px)] font-extrabold text-vs-dark leading-[1.1] mb-4">
              {svc.title}
            </h1>
            {has(hero?.tagline) && (
              <p className="text-[18px] text-vs-gray-700 leading-[1.55] mb-6 whitespace-pre-line">{hero!.tagline}</p>
            )}
            {(has(hero?.statBig) || has(hero?.statSub)) && (
              <div className="mb-6 flex items-baseline gap-3 flex-wrap">
                {has(hero?.statBig) && <span className="text-[44px] font-extrabold text-vs-blue leading-none">{hero!.statBig}</span>}
                {has(hero?.statSub) && <span className="text-[14px] text-vs-gray-600">{hero!.statSub}</span>}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {has(hero?.ctaPrimary?.text) && (
                <Link href={hero!.ctaPrimary!.href || '/contact'} className="inline-flex items-center gap-2 bg-vs-orange text-white px-7 py-3.5 rounded-vs font-extrabold text-[15px] hover:bg-vs-orange-dark transition-all shadow-md">
                  {hero!.ctaPrimary!.text}
                </Link>
              )}
              {has(hero?.ctaSecondary?.text) && (
                <Link href={hero!.ctaSecondary!.href || '#'} className="inline-flex items-center gap-2 bg-white text-vs-blue border-2 border-vs-blue px-7 py-3.5 rounded-vs font-extrabold text-[15px] hover:bg-vs-blue-light transition-all">
                  {hero!.ctaSecondary!.text}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────────── */}
      {!trust?.hidden && has(trust?.text) && (
        <div className="bg-vs-blue text-white">
          <div className="max-w-8xl mx-auto px-6 py-3 text-center text-[14px] font-semibold">
            {trust!.text}
          </div>
        </div>
      )}

      {/* ── Pain Points ──────────────────────────────────────────────── */}
      {!pain?.hidden && pain && pain.items.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-8xl mx-auto px-6">
            {has(pain.heading) && (
              <h2 className="text-center text-[clamp(22px,3vw,32px)] font-extrabold text-vs-dark mb-10 leading-tight">
                {pain.heading}
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {pain.items.map((it, i) => (
                <div key={i} className="bg-white border border-vs-gray-200 rounded-2xl p-6 hover:shadow-vs-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-vs-orange-light text-vs-orange flex items-center justify-center">
                      {it.iconName ? <DynamicIcon name={it.iconName} className="h-5 w-5" /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                    </div>
                    <h3 className="text-[15px] font-extrabold text-vs-dark">{it.title}</h3>
                  </div>
                  {it.description && <p className="text-[14px] text-vs-gray-600 leading-[1.65] whitespace-pre-line">{it.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Solutions + Demo ─────────────────────────────────────────── */}
      {(!sol?.hidden && sol && sol.items.length > 0) || (!demo?.hidden && demo && (has(demo.videoUrl) || has(demo.imageSrc))) ? (
        <section className="py-16 bg-vs-bg">
          <div className="max-w-8xl mx-auto px-6">
            <div className={`grid grid-cols-1 ${!sol?.hidden && !demo?.hidden && sol && demo && (has(demo.videoUrl) || has(demo.imageSrc)) ? 'lg:grid-cols-[5fr_7fr]' : 'grid-cols-1'} gap-8 items-stretch`}>
              {!sol?.hidden && sol && sol.items.length > 0 && (
                <div className="flex flex-col min-h-0">
                  {has(sol.heading) && (
                    <h2 className="text-[clamp(22px,3vw,30px)] font-extrabold text-vs-dark mb-5 leading-tight">
                      {sol.heading}
                    </h2>
                  )}
                  <ul className="space-y-2.5 mb-5 flex-1 lg:overflow-y-auto pr-1">
                    {sol.items.map((it, i) => (
                      <li key={i} className="flex items-start gap-3 bg-white rounded-xl p-3.5 shadow-vs">
                        <div className="w-7 h-7 rounded-full bg-vs-blue-light text-vs-blue flex items-center justify-center flex-shrink-0">
                          {it.iconName ? <DynamicIcon name={it.iconName} className="h-4 w-4" /> : '✓'}
                        </div>
                        <span className="text-[14.5px] text-vs-dark leading-[1.55]">{it.text}</span>
                      </li>
                    ))}
                  </ul>
                  {(has(sol.ctaPrimary?.text) || has(sol.ctaSecondary?.text)) && (
                    <div className="flex flex-wrap gap-3">
                      {has(sol.ctaPrimary?.text) && (
                        <Link href={sol.ctaPrimary!.href || '/contact'} className="bg-vs-orange text-white px-6 py-3 rounded-vs font-extrabold text-[14px] hover:bg-vs-orange-dark transition-all">
                          {sol.ctaPrimary!.text}
                        </Link>
                      )}
                      {has(sol.ctaSecondary?.text) && (
                        <Link href={sol.ctaSecondary!.href || '#'} className="bg-white text-vs-blue border-2 border-vs-blue px-6 py-3 rounded-vs font-extrabold text-[14px] hover:bg-vs-blue-light transition-all">
                          {sol.ctaSecondary!.text}
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}
              {!demo?.hidden && demo && (has(demo.videoUrl) || has(demo.imageSrc)) && (
                <div className="flex flex-col">
                  <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-vs-lg bg-vs-gray-900">
                    {has(demo.videoUrl) ? (
                      (() => {
                        const embed = ytEmbedUrl(demo.videoUrl!)
                        return embed ? (
                          <iframe src={embed} className="absolute inset-0 w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                        ) : (
                          <video src={demo.videoUrl} controls className="absolute inset-0 w-full h-full object-cover" />
                        )
                      })()
                    ) : has(demo.imageSrc) ? (
                      <Image src={demo.imageSrc!} alt={demo.imageAlt ?? 'Demo'} fill unoptimized className="object-cover" />
                    ) : null}
                  </div>
                  {has(demo.caption) && <p className="text-center text-[13px] text-vs-gray-500 italic mt-3 whitespace-pre-line">{demo.caption}</p>}
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Features ─────────────────────────────────────────────────── */}
      {!feat?.hidden && feat && feat.items.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-8xl mx-auto px-6">
            {has(feat.heading) && (
              <h2 className="text-center text-[clamp(22px,3vw,32px)] font-extrabold text-vs-dark mb-12 leading-tight">
                {feat.heading}
              </h2>
            )}
            <div className="space-y-6">
              {feat.items.map((it, i) => {
                const hasImg = has(it.imageSrc)
                const imageRight = i % 2 === 0
                const accent = i % 2 === 0 ? 'vs-blue' : 'vs-orange'
                return (
                  <div
                    key={i}
                    className={`bg-white rounded-2xl overflow-hidden border-2 ${accent === 'vs-blue' ? 'border-vs-blue-100 shadow-[0_8px_30px_rgba(30,91,198,0.08)] hover:shadow-[0_14px_50px_rgba(30,91,198,0.18)] hover:border-vs-blue' : 'border-orange-100 shadow-[0_8px_30px_rgba(244,121,32,0.08)] hover:shadow-[0_14px_50px_rgba(244,121,32,0.18)] hover:border-vs-orange'} hover:-translate-y-0.5 transition-all duration-300 ${hasImg ? 'grid grid-cols-1 lg:grid-cols-2 items-stretch' : 'p-6'}`}
                  >
                    <div className={`p-6 lg:p-8 flex flex-col justify-center ${hasImg && !imageRight ? 'lg:order-2' : ''}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-11 h-11 rounded-xl ${accent === 'vs-blue' ? 'bg-vs-blue' : 'bg-vs-orange'} text-white flex items-center justify-center text-lg font-extrabold flex-shrink-0 shadow-md`}>
                          {String(i + 1).padStart(2, '0')}
                        </div>
                        <h3 className="text-[18px] font-extrabold text-vs-dark leading-snug">{it.title}</h3>
                      </div>
                      <ul className="space-y-1.5">
                        {it.bullets.filter(has).map((b, bi) => (
                          <li key={bi} className="flex items-start gap-2 text-[14px] text-vs-gray-700 leading-[1.6]">
                            <span className={`mt-1 flex-shrink-0 ${accent === 'vs-blue' ? 'text-vs-blue' : 'text-vs-orange'}`}>•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {hasImg && (
                      <div className={`relative bg-vs-gray-100 ${imageRight ? '' : 'lg:order-1'} min-h-[240px] lg:min-h-0`}>
                        <Image src={it.imageSrc!} alt={it.imageAlt ?? it.title} fill unoptimized sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Pricing ──────────────────────────────────────────────────── */}
      {!price?.hidden && price && price.plans.length > 0 && (
        <section className="py-16 bg-vs-bg" id="pricing">
          <div className="max-w-8xl mx-auto px-6">
            {has(price.heading) && (
              <h2 className="text-center text-[clamp(22px,3vw,32px)] font-extrabold text-vs-dark mb-2 leading-tight">
                {price.heading}
              </h2>
            )}
            {has(price.description) && (
              <p className="text-center text-[15px] text-vs-gray-600 mb-10 max-w-2xl mx-auto whitespace-pre-line">{price.description}</p>
            )}
            <div className={`grid grid-cols-1 ${price.plans.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-6`}>
              {price.plans.map((plan, i) => {
                const discount = calcDiscount(plan.originalPrice, plan.price)
                return (
                  <div key={i} className={`relative bg-white rounded-2xl p-6 border-2 flex flex-col ${plan.featured ? 'border-vs-orange shadow-[0_8px_32px_rgba(244,121,32,0.15)]' : 'border-vs-gray-200'}`}>
                    {discount !== null && (
                      <span className="absolute -top-3 -right-3 inline-flex items-center bg-red-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
                        -{discount}%
                      </span>
                    )}
                    {plan.badge && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-vs-orange text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                        {plan.badge}
                      </span>
                    )}
                    <div className="text-[20px] font-extrabold text-vs-dark mb-1">{plan.name}</div>
                    {plan.subtitle && <div className="text-[12px] text-vs-gray-500 mb-4 whitespace-pre-line">{plan.subtitle}</div>}
                    <div className="mb-1">
                      {plan.originalPrice && <span className="text-[14px] text-vs-gray-400 line-through mr-2">{plan.originalPrice}</span>}
                      <span className="text-[32px] font-extrabold text-vs-blue">{plan.price}</span>
                    </div>
                    {plan.period && <div className="text-[12px] text-vs-gray-500 mb-5">{plan.period}</div>}
                    <ul className="space-y-2 mb-6 flex-1">
                      {plan.features.filter(has).map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2 text-[13px] text-vs-gray-700">
                          <span className="text-vs-blue mt-0.5">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={plan.ctaHref || '/contact'} className={`block w-full text-center py-3 rounded-lg text-[14px] font-extrabold transition-all ${plan.featured ? 'bg-vs-orange text-white hover:bg-vs-orange-dark' : 'bg-white text-vs-blue border-2 border-vs-blue hover:bg-vs-blue-light'}`}>
                      {plan.ctaText}
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Commitments ──────────────────────────────────────────────── */}
      {com && com.items.length > 0 && (
        <section className="py-16 bg-vs-dark-gradient relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-vs-orange/20 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-blue-400/30 blur-[100px] pointer-events-none" />
          <div className="max-w-8xl mx-auto px-6 relative">
            <div className="text-center mb-12">
              {has(com.heading) && (
                <h2 className="text-[clamp(24px,3.2vw,36px)] font-extrabold text-white leading-tight">
                  {com.heading}
                </h2>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {com.items.slice(0, 5).map((it, i) => (
                <div key={i} className="group relative bg-white rounded-2xl p-6 text-center shadow-[0_10px_40px_rgba(0,0,0,0.25)] hover:shadow-[0_18px_50px_rgba(244,121,32,0.35)] hover:-translate-y-1.5 transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-vs-gradient text-white flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-105 transition-transform">
                    {it.iconName ? <DynamicIcon name={it.iconName} className="h-8 w-8" /> : <span className="text-2xl">★</span>}
                  </div>
                  <h3 className="text-[15px] font-extrabold text-vs-dark mb-2 leading-snug">{it.title}</h3>
                  {it.description && <p className="text-[12.5px] text-vs-gray-600 leading-[1.65] whitespace-pre-line">{it.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      {!test?.hidden && test && test.items.length > 0 && (
        <section className="py-16 bg-vs-bg">
          <div className="max-w-8xl mx-auto px-6">
            {has(test.heading) && (
              <h2 className="text-center text-[clamp(22px,3vw,32px)] font-extrabold text-vs-dark mb-10 leading-tight">
                {test.heading}
              </h2>
            )}
            <TestimonialsCarousel items={test.items} />
          </div>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      {!faq?.hidden && faq && faq.items.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-8xl mx-auto px-6">
            {has(faq.heading) && (
              <h2 className="text-center text-[clamp(22px,3vw,32px)] font-extrabold text-vs-dark mb-10 leading-tight">
                {faq.heading}
              </h2>
            )}
            <div className="space-y-3 max-w-3xl mx-auto">
              {faq.items.map((it, i) => (
                <details key={i} className="bg-vs-bg rounded-xl group">
                  <summary className="cursor-pointer flex items-center justify-between gap-4 px-5 py-4 text-[15px] font-bold text-vs-dark hover:text-vs-blue transition-colors">
                    <span>{it.q}</span>
                    <span className="text-vs-blue text-xl transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <div className="px-5 pb-4 text-[14px] text-vs-gray-600 leading-[1.75] whitespace-pre-line">{it.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Related ──────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="py-14 bg-vs-bg">
          <div className="max-w-8xl mx-auto px-6">
            <h2 className="text-center text-[20px] sm:text-[24px] font-extrabold text-vs-dark mb-8">
              Các dịch vụ khác của Vsoftware
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p) => (
                <Link key={p.id} href={`/${SERVICES_URL}/${p.slug}`} className="bg-white rounded-2xl p-5 shadow-vs hover:shadow-vs-md hover:-translate-y-1 transition-all flex gap-4 no-underline">
                  <div className="w-14 h-14 rounded-xl bg-vs-blue-light overflow-hidden flex-shrink-0 p-2">
                    {p.logoUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={p.logoUrl} alt={p.title} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-vs-blue text-xl">🛠</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-extrabold text-vs-dark mb-1 leading-snug line-clamp-2">{p.title}</div>
                    <div className="text-[12px] text-vs-gray-600 line-clamp-2">{p.excerpt}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Final CTA (shared with homepage) ─────────────────────────── */}
      <CtaSection config={sharedCta} />

      {/* ── Sticky bottom bar ────────────────────────────────────────── */}
      {sticky?.enabled && (
        <StickyBottomBar
          productName={svc.shortName || svc.title}
          logoUrl={svc.logoUrl ?? undefined}
          priceLabel={sticky.priceLabel || featuredPlan?.price}
          ctaPrimaryText={sticky.ctaPrimaryText || 'Mua ngay'}
          ctaPrimaryHref={sticky.ctaPrimaryHref || featuredPlan?.ctaHref || '/contact'}
          ctaSecondaryText={sticky.ctaSecondaryText}
          ctaSecondaryHref={sticky.ctaSecondaryHref}
        />
      )}
    </>
  )
}

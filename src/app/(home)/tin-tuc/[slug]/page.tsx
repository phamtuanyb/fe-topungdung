import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import type { Category, Post } from '@/types'
import { getCategories, getCategoryPosts, getPost, getTudHomeConfig } from '@/lib/api/public'
import { decodeHtmlContent } from '@/lib/utils'
import { mergeTudConfig } from '../../default-config'
import { TudFooter, TudHeader } from '../../_components/TudChrome'
import {
  BackToTop,
  ReadingProgress,
  ShareBar,
  TableOfContents,
} from '../../_components/ArticleTools'
import { buildToc, readingMinutes } from '../../_lib/article'
import { collectCategoryIds } from '@/lib/category-tree'

export const revalidate = 60

interface Props {
  params: { slug: string }
}

function fmtDate(v?: string | null) {
  if (!v) return null
  try {
    return new Date(v).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug)
    .then((r) => r.data)
    .catch(() => null)
  if (!post) return { title: { absolute: 'Bài viết không tồn tại' } }

  return {
    title: { absolute: post.seoTitle || `${post.title} | TopỨngDụng` },
    description: post.seoDescription || post.excerpt || undefined,
    alternates: { canonical: `/tin-tuc/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.thumbnail ? [post.thumbnail] : undefined,
      type: 'article',
      publishedTime: post.publishedAt || undefined,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const post = await getPost(params.slug)
    .then((r) => r.data)
    .catch(() => null)
  if (!post) notFound()

  const cats: Category[] = await getCategories()
    .then((r) => r.data)
    .catch(() => [])

  // Ứng dụng đã chuyển sang /app/<slug> — không phục vụ ở /tin-tuc nữa.
  const appIds = collectCategoryIds(cats, 'ung-dung')
  const catId = post.category?.id ?? post.categoryId
  if (catId != null && appIds.has(catId)) {
    permanentRedirect(`/app/${params.slug}`)
  }

  // Prompt có đường riêng /prompt/<nhóm>/<slug>. Không phục vụ ở đây để một
  // nội dung không tồn tại ở hai URL khác nhau.
  const promptCat = post.category?.slug?.startsWith('prompt-') ? post.category.slug : null
  if (promptCat) {
    permanentRedirect(`/prompt/${promptCat.replace(/^prompt-/, '')}/${params.slug}`)
  }

  // Bài của Vsoftware cũ (dịch vụ, sản phẩm AI Agent) không thuộc nội dung
  // TopỨngDụng. Trang /dich-vu và /ai-agent đã gỡ nên không phục vụ ở đây nữa;
  // bài vẫn còn trong DB và sửa được ở /admin/posts.
  if (post.category && ['services', 'ai-agent'].includes(post.category.slug)) {
    notFound()
  }

  const cfgRes = await getTudHomeConfig().catch(() => ({ data: null }))
  const config = mergeTudConfig(cfgRes.data)

  // Ba bài đọc tiếp. Ưu tiên cùng chuyên mục, nhưng chuyên mục nhỏ thường chỉ
  // có một, hai bài — khi đó lấy bù từ toàn mục Tin tức thay vì giấu luôn khối
  // này đi, vì cuối bài mà không có lối đi tiếp thì người đọc thoát hẳn.
  const CAN_DOC_TIEP = 3
  const cungMuc = post.category?.slug
    ? await getCategoryPosts(post.category.slug, { limit: 6 })
        .then((r) => (r.data ?? []).filter((p) => p.slug !== post.slug).slice(0, CAN_DOC_TIEP))
        .catch(() => [] as Post[])
    : []

  let related = cungMuc
  if (related.length < CAN_DOC_TIEP) {
    const buThem = await getCategoryPosts('tin-tuc', { limit: 12 })
      .then((r) =>
        (r.data ?? []).filter(
          (p) => p.slug !== post.slug && !cungMuc.some((x) => x.slug === p.slug),
        ),
      )
      .catch(() => [] as Post[])
    related = [...cungMuc, ...buThem].slice(0, CAN_DOC_TIEP)
  }
  // Khối chỉ thuần một chuyên mục thì nói rõ tên chuyên mục; có bài lấy bù thì
  // không nói, để dòng mô tả không hứa sai.
  const cungMucCaKhoi = related.length > 0 && related.every((p) => p.category?.id === post.category?.id)

  // Gắn id cho h2/h3 để làm mục lục neo được.
  const raw = post.content ? decodeHtmlContent(post.content) : ''
  const { html, toc } = buildToc(raw)
  const minutes = readingMinutes(raw)
  const date = fmtDate(post.publishedAt || post.createdAt)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://topungdung.net'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.thumbnail || undefined,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    author: post.author?.fullName
      ? { '@type': 'Person', name: post.author.fullName }
      : undefined,
    mainEntityOfPage: `${siteUrl}/tin-tuc/${post.slug}`,
    articleSection: post.category?.name,
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />
      <TudHeader config={config.header} />

      <main>
        {/* ── ĐẦU BÀI ───────────────────────────────────────────── */}
        <section className="cat-hero">
          <div className="wrap">
            <div className="crumb">
              <a href="/">Trang chủ</a> <span>/</span> <a href="/tin-tuc">Tin tức</a>
              {post.category && (
                <>
                  {' '}
                  <span>/</span> <span>{post.category.name}</span>
                </>
              )}
            </div>
            {post.category && <div className="eyebrow">{post.category.name.toUpperCase()}</div>}
            <h1>{post.title}</h1>
            {post.excerpt && <p className="art-lead">{post.excerpt}</p>}
            <div className="art-meta">
              {post.author?.fullName && <span>{post.author.fullName}</span>}
              {post.author?.fullName && date && <span className="sep">·</span>}
              {date && <span>{date}</span>}
              <span className="sep">·</span>
              <span>{minutes} phút đọc</span>
              <span className="sep">·</span>
              <span>{post.viewCount ?? 0} lượt xem</span>
            </div>
            <ShareBar title={post.title} />
          </div>
        </section>

        {post.thumbnail && (
          <section className="section" style={{ paddingTop: 22, paddingBottom: 0 }}>
            <div className="wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="art-cover" src={post.thumbnail} alt={post.title}  width={960} height={540} loading="lazy" decoding="async"/>
            </div>
          </section>
        )}

        {/* ── NỘI DUNG + MỤC LỤC ────────────────────────────────── */}
        {html && (
          <section className="section">
            <div className="wrap">
              <div className="art-layout">
                <article className="art-body" dangerouslySetInnerHTML={{ __html: html }} />
                <TableOfContents items={toc} />
              </div>
            </div>
          </section>
        )}

        {/* ── ĐỌC TIẾP ──────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="section">
            <div className="wrap">
              <div className="section-title">
                <div>
                  <div className="eyebrow">ĐỌC TIẾP</div>
                  <h2 style={{ marginTop: 14, fontSize: 'clamp(26px,3vw,40px)' }}>
                    Bài viết liên quan
                  </h2>
                </div>
                <p>
                  {cungMucCaKhoi
                    ? `Cùng chuyên mục ${post.category?.name}.`
                    : 'Các bài khác trong mục Tin tức.'}
                </p>
              </div>
              <div className="news-grid">
                {related.map((p) => (
                  <a className="news-card" href={`/tin-tuc/${p.slug}`} key={p.id}>
                    {p.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="news-thumb" src={p.thumbnail} alt={p.title}  width={640} height={360} loading="lazy" decoding="async"/>
                    ) : (
                      <div className="news-thumb img-slot">Ảnh</div>
                    )}
                    <div className="news-body">
                      <div className="meta">{p.category?.name?.toUpperCase() ?? 'BÀI VIẾT'}</div>
                      <h3>{p.title}</h3>
                      <p>{p.excerpt}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <TudFooter header={config.header} footer={config.footer} />
      <BackToTop />
    </div>
  )
}

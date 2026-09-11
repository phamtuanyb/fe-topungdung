/** Tiện ích xử lý nội dung bài viết: mục lục, thời gian đọc. */

export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

/** Bỏ dấu tiếng Việt và chuyển thành slug dùng làm id neo. */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // bỏ dấu thanh và dấu phụ
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60)
}

/**
 * Gắn id vào các thẻ h2/h3 trong nội dung và trả về mục lục tương ứng.
 * Không đụng tới phần còn lại của HTML.
 */
export function buildToc(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = []
  const used = new Set<string>()

  const out = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, lvl: string, attrs: string, inner: string) => {
      const text = inner
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .trim()
      if (!text) return match

      // Giữ nguyên id nếu tác giả đã tự đặt
      const existing = /\sid=["']([^"']+)["']/i.exec(attrs)
      let id = existing?.[1] ?? slugify(text)
      if (!id) return match

      let n = 2
      while (used.has(id)) id = `${slugify(text)}-${n++}`
      used.add(id)

      toc.push({ id, text, level: lvl === '3' ? 3 : 2 })

      const cleaned = attrs.replace(/\sid=["'][^"']*["']/i, '')
      return `<h${lvl}${cleaned} id="${id}">${inner}</h${lvl}>`
    },
  )

  return { html: out, toc }
}

/** Ước lượng thời gian đọc — 200 từ/phút, tối thiểu 1 phút. */
export function readingMinutes(html: string): number {
  const words = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

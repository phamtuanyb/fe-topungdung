// Ước tính số phút đọc từ HTML content
// Tiếng Việt: ~200 từ/phút (tốc độ đọc trung bình)
export function estimateReadingTime(html?: string | null): number {
  if (!html) return 1
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = text ? text.split(' ').length : 0
  return Math.max(1, Math.ceil(wordCount / 200))
}

// Ước tính từ excerpt: excerpt thường ~1/10 chiều dài content thật
// → nhân số từ excerpt × 10, chia 200 từ/phút. Tối thiểu 3 phút.
export function estimateReadingTimeFromExcerpt(excerpt?: string | null): number {
  if (!excerpt) return 3
  const wordCount = excerpt.trim().split(/\s+/).length
  const estimatedFullWords = wordCount * 10
  return Math.max(3, Math.ceil(estimatedFullWords / 200))
}

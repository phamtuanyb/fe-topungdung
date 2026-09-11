import { apiClient } from './client'
import type { Post, Category, PaginatedResponse, ApiResponse, Menu, ContactConfig } from '@/types'
import type { TudHomeConfig, TudRelatedConfig, TudVoteSummary } from '@/types/tud'

export interface GetPostsParams {
  page?: number
  limit?: number
  category?: string
  search?: string
}

interface BackendPaginatedResponse<T> {
  data: T[]
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export function getPosts(params: GetPostsParams = {}): Promise<PaginatedResponse<Post>> {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  if (params.category) query.set('category', params.category)
  if (params.search) query.set('search', params.search)
  const qs = query.toString()
  return apiClient.get<BackendPaginatedResponse<Post>>(`/api/posts${qs ? `?${qs}` : ''}`).then((res) => {
    if (res && res.meta) {
      return {
        data: res.data,
        total: res.meta.total,
        page: res.meta.page,
        limit: res.meta.limit,
        totalPages: res.meta.totalPages,
      }
    }
    return res as unknown as PaginatedResponse<Post>
  })
}

export function getPost(slug: string): Promise<ApiResponse<Post>> {
  return apiClient.get(`/api/posts/${slug}`)
}

export function getCategories(): Promise<ApiResponse<Category[]>> {
  return apiClient.get('/api/categories')
}

export async function getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
  const res = await getCategories()
  const category = res.data.find((c) => c.slug === slug)
  if (!category) {
    throw new Error(`Category with slug "${slug}" not found`)
  }
  return { data: category }
}

export function getCategoryPosts(
  slug: string,
  params: { page?: number; limit?: number } = {}
): Promise<PaginatedResponse<Post>> {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  const qs = query.toString()
  return apiClient.get<BackendPaginatedResponse<Post>>(`/api/categories/${slug}/posts${qs ? `?${qs}` : ''}`).then((res) => {
    if (res && res.meta) {
      return {
        data: res.data,
        total: res.meta.total,
        page: res.meta.page,
        limit: res.meta.limit,
        totalPages: res.meta.totalPages,
      }
    }
    return res as unknown as PaginatedResponse<Post>
  })
}

export function getNavMenu(): Promise<ApiResponse<Menu>> {
  return apiClient.get('/api/menus/nav-menu')
}

export interface ContactPayload {
  name: string
  phone: string
  email?: string
  company?: string
  need: string
  description?: string
}

export function submitContact(payload: ContactPayload): Promise<ApiResponse<{ message: string }>> {
  return apiClient.post('/api/contact', payload)
}

export function getContactConfig(): Promise<{ data: ContactConfig }> {
  return apiClient.get('/api/settings/contact')
}

// ─── TopỨngDụng homepage ──────────────────────────────────────────────────────

export function getTudHomeConfig(): Promise<{ data: TudHomeConfig }> {
  return apiClient.get('/api/settings/tud-home')
}

/** Danh sách app (posts trong danh mục "ung-dung"), sắp theo điểm giảm dần. */
export function getTudApps(limit = 50): Promise<PaginatedResponse<Post>> {
  return getCategoryPosts('ung-dung', { limit })
}

/**
 * Cấu hình khối "công cụ liên quan" hiển thị chéo giữa các danh mục.
 * Trả về object rỗng nếu chưa cấu hình — trang danh mục sẽ bỏ qua khối này.
 */
export function getTudRelated(): Promise<{ data: TudRelatedConfig }> {
  return apiClient.get('/api/settings/tud-related')
}

// ─── Bình chọn ứng dụng ───────────────────────────────────────────────────────
// Các hàm ghi phải gọi TỪ TRÌNH DUYỆT để backend lấy đúng IP/User-Agent của
// khách; gọi từ server component sẽ tính nhầm thành IP của máy chủ Next.

export function getVoteSummary(slug: string): Promise<{ data: TudVoteSummary }> {
  return apiClient.get(`/api/apps/${slug}/vote`, false, { revalidate: false })
}

export function submitVote(slug: string, rating: number): Promise<{ data: TudVoteSummary }> {
  return apiClient.post(`/api/apps/${slug}/vote`, { rating })
}

export function removeVote(slug: string): Promise<{ data: TudVoteSummary }> {
  return apiClient.delete(`/api/apps/${slug}/vote`)
}

/** Thống kê phiếu của mọi ứng dụng — dùng cho trang xếp hạng (gọi ở server được). */
export function getAllVoteSummaries(): Promise<{
  data: Record<string, { average: number; count: number }>
}> {
  // Không cache: bầu xong phải thấy ngay, không chờ hết vòng ISR.
  return apiClient.get('/api/apps/vote-summary', false, { revalidate: false })
}

// ─── Tìm kiếm & đề xuất ứng dụng ─────────────────────────────────────────────

/** Tìm bài viết + ứng dụng theo tiêu đề/mô tả. Không phân biệt hoa thường. */
export function searchPosts(q: string, limit = 20): Promise<PaginatedResponse<Post>> {
  const query = new URLSearchParams({ search: q, limit: String(limit) })
  return apiClient
    .get<BackendPaginatedResponse<Post>>(`/api/posts?${query.toString()}`, false, {
      revalidate: 60,
    })
    .then((res) => ({
      data: res.data ?? [],
      total: res.meta?.total ?? 0,
      page: res.meta?.page ?? 1,
      limit: res.meta?.limit ?? limit,
      totalPages: res.meta?.totalPages ?? 1,
    }))
}

export interface AppSuggestionPayload {
  /** 'app' = đề xuất ứng dụng, 'prompt' = gửi prompt cho thư viện. Mặc định 'app'. */
  kind?: 'app' | 'prompt'
  /** Tên ứng dụng, hoặc tiêu đề prompt khi kind = 'prompt' */
  appName: string
  website?: string
  categorySlug?: string
  reason?: string
  submitterName?: string
  submitterEmail?: string
}

/** Gửi đề xuất ứng dụng — phải gọi từ trình duyệt để backend nhận đúng IP. */
export function submitAppSuggestion(
  payload: AppSuggestionPayload,
): Promise<{ data: { id: number; message: string } }> {
  return apiClient.post('/api/app-suggestions', payload)
}

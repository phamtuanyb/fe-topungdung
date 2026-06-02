import { apiClient } from './client'
import type { Post, Category, PaginatedResponse, ApiResponse, Menu, FooterConfig, HomepageConfig, ContactConfig, CommitmentsConfig } from '@/types'

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

export function getFooterConfig(): Promise<{ data: FooterConfig }> {
  return apiClient.get('/api/settings/footer')
}

export function getHomepageConfig(): Promise<{ data: HomepageConfig }> {
  return apiClient.get('/api/settings/homepage')
}

export function getContactConfig(): Promise<{ data: ContactConfig }> {
  return apiClient.get('/api/settings/contact')
}

export function getCommitmentsConfig(): Promise<{ data: CommitmentsConfig }> {
  return apiClient.get('/api/settings/commitments')
}


import { apiClient } from './client'
import type {
  Post,
  Category,
  Media,
  Menu,
  MenuItem,
  LoginPayload,
  CreatePostPayload,
  CreateCategoryPayload,
  CreateMenuPayload,
  UpdateMenuPayload,
  CreateMenuItemPayload,
  UpdateMenuItemPayload,
  ReorderMenuItemPayload,
  PaginatedResponse,
  ApiResponse,
  SeoScoreResult,
  SeoAnalyzePayload,
  FooterConfig,
  HomepageConfig,
  ContactConfig,
  CommitmentsConfig,
} from '@/types'

// Auth
export interface AuthTokenResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: number
    fullName: string
    email: string
    role: string
  }
}

export function adminLogin(payload: LoginPayload): Promise<{ data: AuthTokenResponse }> {
  return apiClient.post('/api/admin/auth/login', payload)
}

export function adminRefreshToken(refreshToken: string): Promise<{ data: AuthTokenResponse }> {
  return apiClient.post('/api/admin/auth/refresh', { refreshToken })
}

export function adminGetMe(): Promise<{ data: AuthTokenResponse['user'] }> {
  return apiClient.get('/api/admin/auth/me', true)
}

export function adminLogout(): Promise<void> {
  return apiClient.post('/api/admin/auth/logout', {}, true)
}

// ─── Users ───────────────────────────────────────────────────────────────────

export interface AdminUserItem {
  id: number
  fullName: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface CreateUserPayload {
  email: string
  password: string
  fullName: string
  role?: 'admin' | 'user'
  status?: 'active' | 'inactive'
}

export interface UpdateUserPayload {
  fullName?: string
  email?: string
  role?: 'admin' | 'user'
  status?: 'active' | 'inactive'
}

export function adminGetUsers(): Promise<{ data: AdminUserItem[] }> {
  return apiClient.get('/api/admin/users', true)
}

export function adminGetUser(id: number): Promise<{ data: AdminUserItem }> {
  return apiClient.get(`/api/admin/users/${id}`, true)
}

export function adminCreateUser(payload: CreateUserPayload): Promise<{ data: AdminUserItem }> {
  return apiClient.post('/api/admin/users', payload, true)
}

export function adminUpdateUser(id: number, payload: UpdateUserPayload): Promise<{ data: AdminUserItem }> {
  return apiClient.patch(`/api/admin/users/${id}`, payload, true)
}

export function adminDeleteUser(id: number): Promise<void> {
  return apiClient.delete(`/api/admin/users/${id}`, true)
}

export function adminChangePassword(id: number, newPassword: string): Promise<void> {
  return apiClient.patch(`/api/admin/users/${id}/change-password`, { newPassword }, true)
}

// ─── Posts ───────────────────────────────────────────────────────────────────

export interface AdminGetPostsParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  categoryId?: number
}

export function adminGetPosts(params: AdminGetPostsParams = {}): Promise<PaginatedResponse<Post>> {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  if (params.search) query.set('search', params.search)
  if (params.status) query.set('status', params.status)
  if (params.categoryId) query.set('categoryId', String(params.categoryId))
  const qs = query.toString()
  return apiClient.get(`/api/admin/posts${qs ? `?${qs}` : ''}`, true)
}

export function adminGetPost(id: number): Promise<ApiResponse<Post>> {
  return apiClient.get(`/api/admin/posts/${id}`, true)
}

export function adminCreatePost(payload: CreatePostPayload): Promise<ApiResponse<Post>> {
  return apiClient.post('/api/admin/posts', payload, true)
}

export function adminUpdatePost(id: number, payload: Partial<CreatePostPayload>): Promise<ApiResponse<Post>> {
  return apiClient.patch(`/api/admin/posts/${id}`, payload, true)
}

export function adminDeletePost(id: number): Promise<ApiResponse<void>> {
  return apiClient.delete(`/api/admin/posts/${id}`, true)
}

export function adminPublishPost(id: number): Promise<ApiResponse<Post>> {
  return apiClient.patch(`/api/admin/posts/${id}/publish`, {}, true)
}

export function adminDraftPost(id: number): Promise<ApiResponse<Post>> {
  return apiClient.patch(`/api/admin/posts/${id}/draft`, {}, true)
}

export function adminAnalyzePostSeo(id: number | string, payload: SeoAnalyzePayload): Promise<SeoScoreResult> {
  return apiClient.post(`/api/admin/posts/${id}/seo-score`, payload, true)
}

// ─── Categories ──────────────────────────────────────────────────────────────

export function adminGetCategories(): Promise<ApiResponse<Category[]>> {
  return apiClient.get('/api/admin/categories', true)
}

export function adminGetCategory(id: number): Promise<ApiResponse<Category>> {
  return apiClient.get(`/api/admin/categories/${id}`, true)
}

export function adminCreateCategory(payload: CreateCategoryPayload): Promise<ApiResponse<Category>> {
  return apiClient.post('/api/admin/categories', payload, true)
}

export function adminUpdateCategory(id: number, payload: Partial<CreateCategoryPayload>): Promise<ApiResponse<Category>> {
  return apiClient.patch(`/api/admin/categories/${id}`, payload, true)
}

export function adminDeleteCategory(id: number): Promise<ApiResponse<void>> {
  return apiClient.delete(`/api/admin/categories/${id}`, true)
}

// ─── Media ───────────────────────────────────────────────────────────────────

export function adminGetMedia(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Media>> {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  const qs = query.toString()
  return apiClient.get(`/api/admin/media${qs ? `?${qs}` : ''}`, true)
}

export function adminGetMediaItem(id: number): Promise<ApiResponse<Media>> {
  return apiClient.get(`/api/admin/media/${id}`, true)
}

export function adminUploadMedia(
  file: File,
  metadata?: { altText?: string; caption?: string },
): Promise<ApiResponse<Media>> {
  const formData = new FormData()
  formData.append('file', file)
  if (metadata?.altText)  formData.append('altText', metadata.altText)
  if (metadata?.caption)  formData.append('caption', metadata.caption)
  return apiClient.upload('/api/admin/media/upload', formData)
}

export function adminImportMediaFromUrl(
  url: string,
  metadata?: { altText?: string; caption?: string },
): Promise<ApiResponse<Media>> {
  return apiClient.post('/api/admin/media/import-url', { url, ...metadata }, true)
}

export function adminDeleteMedia(id: number): Promise<void> {
  return apiClient.delete(`/api/admin/media/${id}`, true)
}

export function adminUpdateMedia(
  id: number,
  payload: { fileName?: string; altText?: string; caption?: string },
): Promise<ApiResponse<Media>> {
  return apiClient.patch(`/api/admin/media/${id}`, payload, true)
}

// ─── Menus ───────────────────────────────────────────────────────────────────

export function adminGetMenus(): Promise<ApiResponse<Menu[]>> {
  return apiClient.get('/api/admin/menus', true)
}

export function adminGetMenu(id: number): Promise<ApiResponse<Menu>> {
  return apiClient.get(`/api/admin/menus/${id}`, true)
}

export function adminCreateMenu(payload: CreateMenuPayload): Promise<ApiResponse<Menu>> {
  return apiClient.post('/api/admin/menus', payload, true)
}

export function adminUpdateMenu(id: number, payload: UpdateMenuPayload): Promise<ApiResponse<Menu>> {
  return apiClient.patch(`/api/admin/menus/${id}`, payload, true)
}

export function adminDeleteMenu(id: number): Promise<void> {
  return apiClient.delete(`/api/admin/menus/${id}`, true)
}

export function adminAddMenuItem(menuId: number, payload: CreateMenuItemPayload): Promise<ApiResponse<MenuItem>> {
  return apiClient.post(`/api/admin/menus/${menuId}/items`, payload, true)
}

export function adminUpdateMenuItem(
  menuId: number,
  itemId: number,
  payload: UpdateMenuItemPayload
): Promise<ApiResponse<Menu>> {
  return apiClient.patch(`/api/admin/menus/${menuId}/items/${itemId}`, payload, true)
}

export function adminDeleteMenuItem(menuId: number, itemId: number): Promise<void> {
  return apiClient.delete(`/api/admin/menus/${menuId}/items/${itemId}`, true)
}

export function adminReorderMenuItems(
  menuId: number,
  items: ReorderMenuItemPayload[]
): Promise<ApiResponse<Menu>> {
  return apiClient.put(`/api/admin/menus/${menuId}/items/reorder`, { items }, true)
}

// ─── Contacts ────────────────────────────────────────────────────────────────

export interface ContactSubmissionItem {
  id: number
  name: string
  phone: string
  email?: string
  company?: string
  need: string
  description?: string
  createdAt: string
}

export interface ContactsResponse {
  data: ContactSubmissionItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export function adminGetContacts(params: { page?: number; limit?: number } = {}): Promise<ContactsResponse> {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  const qs = query.toString()
  // normalizeApiPayload sẽ spread meta lên top-level → {data:[], total, page, ...}
  return apiClient.get<ContactsResponse>(`/api/admin/contacts${qs ? `?${qs}` : ''}`, true)
}

export function adminDeleteContact(id: number): Promise<void> {
  return apiClient.delete(`/api/admin/contacts/${id}`, true)
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export function adminGetFooterConfig(): Promise<{ data: FooterConfig }> {
  return apiClient.get('/api/settings/footer', true)
}

export function adminUpdateFooterConfig(config: FooterConfig): Promise<{ data: FooterConfig }> {
  return apiClient.put('/api/settings/footer', config, true)
}

export function adminGetHomepageConfig(): Promise<{ data: HomepageConfig }> {
  return apiClient.get('/api/settings/homepage', true)
}

export function adminUpdateHomepageConfig(config: HomepageConfig): Promise<{ data: HomepageConfig }> {
  return apiClient.put('/api/settings/homepage', config, true)
}

export function adminGetContactConfig(): Promise<{ data: ContactConfig }> {
  return apiClient.get('/api/settings/contact', true)
}

export function adminUpdateContactConfig(config: ContactConfig): Promise<{ data: ContactConfig }> {
  return apiClient.put('/api/settings/contact', config, true)
}

export function adminGetCommitmentsConfig(): Promise<{ data: CommitmentsConfig }> {
  return apiClient.get('/api/settings/commitments', true)
}

export function adminUpdateCommitmentsConfig(config: CommitmentsConfig): Promise<{ data: CommitmentsConfig }> {
  return apiClient.put('/api/settings/commitments', config, true)
}

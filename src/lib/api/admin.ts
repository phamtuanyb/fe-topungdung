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
  ContactConfig,
} from '@/types'
import type { TudHomeConfig } from '@/types/tud'

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

export function adminAnalyzeSeoRaw(payload: SeoAnalyzePayload): Promise<SeoScoreResult> {
  return apiClient.post('/api/admin/seo/analyze', { focusKeyword: payload.focusKeyword || '', ...payload }, true)
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

export function adminGetContactConfig(): Promise<{ data: ContactConfig }> {
  return apiClient.get('/api/settings/contact', true)
}

export function adminUpdateContactConfig(config: ContactConfig): Promise<{ data: ContactConfig }> {
  return apiClient.put('/api/settings/contact', config, true)
}

export function adminGetTudHomeConfig(): Promise<{ data: TudHomeConfig }> {
  return apiClient.get('/api/settings/tud-home', true)
}

export function adminUpdateTudHomeConfig(config: TudHomeConfig): Promise<{ data: TudHomeConfig }> {
  return apiClient.put('/api/settings/tud-home', config, true)
}

// ─── Bình chọn ────────────────────────────────────────────────────────────────

export interface AdminVoteRow {
  id: number
  rating: number
  voterKey: string
  createdAt: string
  postSlug: string
  postTitle: string
}

export function adminGetVotes(params: { page?: number; limit?: number } = {}): Promise<{
  data: AdminVoteRow[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}> {
  const q = new URLSearchParams()
  if (params.page) q.set('page', String(params.page))
  if (params.limit) q.set('limit', String(params.limit))
  const qs = q.toString()
  return apiClient.get(`/api/admin/votes${qs ? `?${qs}` : ''}`, true)
}

export function adminDeleteVote(id: number): Promise<{ message: string }> {
  return apiClient.delete(`/api/admin/votes/${id}`, true)
}

// ─── Đề xuất ứng dụng từ khách ───────────────────────────────────────────────

export interface AppSuggestion {
  id: number
  appName: string
  website?: string | null
  categorySlug?: string | null
  reason?: string | null
  submitterName?: string | null
  submitterEmail?: string | null
  status: 'new' | 'reviewing' | 'accepted' | 'rejected'
  adminNote?: string | null
  createdAt: string
}

export function adminGetSuggestions(params: { page?: number; limit?: number; status?: string } = {}) {
  const q = new URLSearchParams()
  if (params.page) q.set('page', String(params.page))
  if (params.limit) q.set('limit', String(params.limit))
  if (params.status) q.set('status', params.status)
  const qs = q.toString()
  return apiClient.get<{ data: AppSuggestion[]; meta: { page: number; limit: number; total: number; totalPages: number } }>(
    `/api/admin/app-suggestions${qs ? `?${qs}` : ''}`,
    true,
  )
}

export function adminGetSuggestionCounts(): Promise<{ data: Record<string, number> }> {
  return apiClient.get('/api/admin/app-suggestions/counts', true)
}

export function adminUpdateSuggestion(
  id: number,
  payload: { status?: string; adminNote?: string },
): Promise<{ data: AppSuggestion }> {
  return apiClient.patch(`/api/admin/app-suggestions/${id}`, payload, true)
}

export function adminDeleteSuggestion(id: number): Promise<{ data: { message: string } }> {
  return apiClient.delete(`/api/admin/app-suggestions/${id}`, true)
}

// ─── Nạp bài từ tệp JSON ─────────────────────────────────────────────────────
// Cách trình bày bài của site không dựng được bằng trình soạn thảo thường, nên
// bài được soạn ngoài rồi nạp qua đây. Backend kiểm chuẩn trước khi ghi.

export interface ImportItemReport {
  slug: string
  action: 'tạo mới' | 'cập nhật' | 'bỏ qua'
  errors: string[]
  stats: { words: number; h2: number; h3: number; tables: number; links: number; faq: number }
  /** Đường dẫn công khai, chỉ có khi bài đạt chuẩn */
  url?: string
  /** Câu văn trùng với bài đã đăng */
  duplicates?: { sentence: string; withSlug: string }[]
}

export interface ImportResult {
  dryRun: boolean
  total: number
  passed: number
  failed: number
  created: number
  updated: number
  reports: ImportItemReport[]
}

export function adminImportPosts(
  items: unknown[],
  dryRun: boolean,
): Promise<{ data: ImportResult }> {
  return apiClient.post('/api/admin/posts/import', { items, dryRun }, true)
}

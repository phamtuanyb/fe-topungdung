import { getToken, getRefreshToken, setToken, setRefreshToken } from '@/lib/auth'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  auth?: boolean
  _retry?: boolean
  // Next.js cache: undefined = mặc định theo auth (public cache 60s, auth no-store)
  revalidate?: number | false
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null
  try {
    const res = await fetch(`${BASE_URL}/api/admin/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    if (!res.ok) return null
    const data = await res.json()
    const newAccess = data?.data?.accessToken || data?.accessToken
    const newRefresh = data?.data?.refreshToken || data?.refreshToken
    if (newAccess) setToken(newAccess)
    if (newRefresh) setRefreshToken(newRefresh)
    return newAccess ?? null
  } catch {
    return null
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = false, headers = {}, _retry = false, revalidate, ...rest } = options

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  }

  if (auth) {
    const token = getToken()
    if (token) reqHeaders['Authorization'] = `Bearer ${token}`
  }

  // Cache strategy:
  // - Auth requests + mutations (POST/PUT/PATCH/DELETE): no-store (luôn fresh)
  // - Public GET: revalidate 60s mặc định (ISR), có thể override qua opts.revalidate
  const method = (rest.method ?? 'GET').toUpperCase()
  const isMutation = method !== 'GET'
  const isPublic = !auth && !isMutation
  const nextOptions: { revalidate?: number | false } = {}
  let cacheOption: RequestCache | undefined

  if (isPublic) {
    if (revalidate === false) {
      cacheOption = 'no-store'
    } else {
      nextOptions.revalidate = revalidate ?? 60
    }
  } else {
    cacheOption = 'no-store'
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: reqHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...(cacheOption ? { cache: cacheOption } : {}),
    ...(nextOptions.revalidate !== undefined ? { next: nextOptions } : {}),
  })

  // Nếu 401 và chưa retry → thử refresh token
  if (res.status === 401 && auth && !_retry) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      reqHeaders['Authorization'] = `Bearer ${newToken}`
      const retryRes = await fetch(`${BASE_URL}${path}`, {
        ...rest,
        headers: reqHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      })
      if (retryRes.ok) return retryRes.json()
      const retryError = await retryRes.json().catch(() => ({ message: retryRes.statusText }))
      throw new Error(retryError?.message || `Request failed: ${retryRes.status}`)
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error?.message || `Request failed: ${res.status}`)
  }

  // Một số endpoint (như DELETE) có thể trả về 204 No Content
  const text = await res.text()
  const parsed = text ? JSON.parse(text) : ({} as T)
  return normalizeApiPayload(parsed) as T
}

/** Backend gói pagination trong `meta`; chuẩn hóa field media `fileName` → `filename`. */
function normalizeApiPayload<T>(payload: T): T {
  if (!payload || typeof payload !== 'object') return payload

  const record = { ...(payload as Record<string, unknown>) }
  const meta = record.meta
  if (meta && typeof meta === 'object') {
    delete record.meta
    Object.assign(record, meta as Record<string, unknown>)
  }

  if (Array.isArray(record.data)) {
    record.data = record.data.map((item) =>
      typeof item === 'object' && item !== null
        ? normalizeMediaItem(item as Record<string, unknown>)
        : item
    )
  } else if (record.data && typeof record.data === 'object') {
    record.data = normalizeMediaItem(record.data as Record<string, unknown>)
  }

  return record as T
}

function normalizeMediaItem(item: Record<string, unknown>): Record<string, unknown> {
  if ('fileName' in item && !('filename' in item)) {
    return { ...item, filename: item.fileName }
  }
  return item
}

export const apiClient = {
  get: <T>(path: string, auth = false) =>
    request<T>(path, { method: 'GET', auth }),

  post: <T>(path: string, body: unknown, auth = false) =>
    request<T>(path, { method: 'POST', body, auth }),

  patch: <T>(path: string, body: unknown, auth = false) =>
    request<T>(path, { method: 'PATCH', body, auth }),

  put: <T>(path: string, body: unknown, auth = false) =>
    request<T>(path, { method: 'PUT', body, auth }),

  delete: <T>(path: string, auth = false) =>
    request<T>(path, { method: 'DELETE', auth }),

  upload: async <T>(path: string, formData: FormData): Promise<T> => {
    const doFetch = (authToken: string | null) =>
      fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        body: formData,
      })

    let res = await doFetch(getToken())

    // Token hết hạn → thử refresh rồi retry
    if (res.status === 401) {
      const newToken = await refreshAccessToken()
      if (newToken) {
        res = await doFetch(newToken)
      }
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: res.statusText }))
      throw new Error(error?.message || `Upload failed: ${res.status}`)
    }
    const json = await res.json()
    return normalizeApiPayload(json) as T
  },
}

export type UserRole = 'admin' | 'user'

export interface AdminUser {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  createdAt: string
}

const STORE_KEY = 'admin_users'

function seedUser(): AdminUser {
  return {
    id: 'seed-admin',
    name: 'Admin',
    email: process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? 'admin@admin.com',
    password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString(),
  }
}

export function getUsers(): AdminUser[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) {
      const initial = [seedUser()]
      localStorage.setItem(STORE_KEY, JSON.stringify(initial))
      return initial
    }
    return JSON.parse(raw) as AdminUser[]
  } catch {
    return []
  }
}

export function getUserById(id: string): AdminUser | undefined {
  return getUsers().find(u => u.id === id)
}

export function getUserByEmail(email: string): AdminUser | undefined {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase())
}

export function createUser(data: Omit<AdminUser, 'id' | 'createdAt'>): AdminUser {
  const users = getUsers()
  const user: AdminUser = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() }
  localStorage.setItem(STORE_KEY, JSON.stringify([...users, user]))
  return user
}

export function updateUser(id: string, data: Partial<Omit<AdminUser, 'id' | 'createdAt'>>): AdminUser | null {
  const users = getUsers()
  const idx = users.findIndex(u => u.id === id)
  if (idx === -1) return null
  users[idx] = { ...users[idx], ...data }
  localStorage.setItem(STORE_KEY, JSON.stringify(users))
  return users[idx]
}

export function deleteUser(id: string): void {
  const users = getUsers().filter(u => u.id !== id)
  localStorage.setItem(STORE_KEY, JSON.stringify(users))
}

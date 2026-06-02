
export type MenuItemType = 'page' | 'post' | 'category' | 'custom'

export interface MenuItem {
  id: number
  label: string
  type: MenuItemType
  targetId?: number | null
  url?: string | null
  order: number
  parentId?: number | null
  children?: MenuItem[]
  depth: number
  menuId: number
}

export interface Menu {
  id: number
  name: string
  slug: string
  description?: string | null
  items?: MenuItem[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateMenuPayload {
  name: string
  slug?: string
  description?: string
}

export interface UpdateMenuPayload {
  name?: string
  slug?: string
  description?: string
}

export interface CreateMenuItemPayload {
  label: string
  type: MenuItemType
  targetId?: number | null
  url?: string
  order?: number
  parentId?: number | null
}

export interface UpdateMenuItemPayload {
  label?: string
  type?: MenuItemType
  targetId?: number | null
  url?: string
  order?: number
  parentId?: number | null
}

export interface ReorderMenuItemPayload {
  id: number
  parentId?: number | null
  order: number
}
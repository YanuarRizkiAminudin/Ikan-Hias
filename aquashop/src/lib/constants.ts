export const APP_NAME = 'AquaShop'
export const APP_TAGLINE = 'Surga Ikan Hias Terlengkap'

export const ROUTES = {
  HOME:            '/',
  CATALOG:         '/catalog',
  PRODUCT:         '/product/:slug',
  EXPORT:          '/export',
  ABOUT:           '/about',
  CONTACT:         '/contact',
  ADMIN_LOGIN:     '/admin/login',
  ADMIN:           '/admin',
  ADMIN_PRODUCTS:  '/admin/products',
  ADMIN_PRODUCT_CREATE: '/admin/products/create',
  ADMIN_PRODUCT_EDIT:   '/admin/products/:id/edit',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_INQUIRIES:  '/admin/inquiries',
  ADMIN_STORE:      '/admin/store',
} as const

export const LOW_STOCK_THRESHOLD = 5

export const PRODUCT_STATUSES = ['active', 'inactive', 'out_of_stock'] as const
export const INQUIRY_STATUSES  = ['new', 'read', 'replied'] as const

export const INQUIRY_STATUS_LABEL: Record<string, string> = {
  new:     'Baru',
  read:    'Dibaca',
  replied: 'Dibalas',
}

export const PRODUCT_STATUS_LABEL: Record<string, string> = {
  active:       'Aktif',
  inactive:     'Nonaktif',
  out_of_stock: 'Habis',
}

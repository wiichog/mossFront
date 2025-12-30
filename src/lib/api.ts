import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    // Handle 401 and refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}/users/token/refresh/`, {
            refresh: refreshToken,
          })
          
          localStorage.setItem('access_token', data.access)
          originalRequest.headers.Authorization = `Bearer ${data.access}`
          
          return api(originalRequest)
        } catch {
          // Refresh failed, clear tokens
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        }
      }
    }
    
    return Promise.reject(error)
  }
)

// API Services
export const productService = {
  getAll: (params?: Record<string, any>) => api.get('/products/', { params }),
  getBySlug: (slug: string) => api.get(`/products/${slug}/`),
  getFeatured: (brandType?: string) => api.get('/products/featured/', { params: { brand_type: brandType } }),
  getNew: (brandType?: string) => api.get('/products/new/', { params: { brand_type: brandType } }),
  getBestsellers: (brandType?: string) => api.get('/products/bestsellers/', { params: { brand_type: brandType } }),
  search: (query: string) => api.get('/products/search/', { params: { q: query } }),
}

export const brandService = {
  getAll: () => api.get('/products/brands/'),
  getBySlug: (slug: string) => api.get(`/products/brands/${slug}/`),
}

export const categoryService = {
  getAll: (brandSlug?: string) => api.get('/products/categories/', { params: { brand: brandSlug } }),
  getBySlug: (slug: string) => api.get(`/products/categories/${slug}/`),
}

export const cartService = {
  get: () => api.get('/orders/cart/'),
  addItem: (productId: number, quantity: number, variantId?: number) =>
    api.post('/orders/cart/items/', { product_id: productId, quantity, variant_id: variantId }),
  updateItem: (itemId: number, quantity: number) =>
    api.put('/orders/cart/items/', { item_id: itemId, quantity }),
  removeItem: (itemId: number) =>
    api.delete('/orders/cart/items/', { data: { item_id: itemId } }),
}

export const orderService = {
  create: (data: any) => api.post('/orders/create/', data),
  getAll: () => api.get('/orders/'),
  getByNumber: (orderNumber: string) => api.get(`/orders/${orderNumber}/`),
  track: (orderNumber: string, email: string) =>
    api.post('/orders/track/', { order_number: orderNumber, email }),
}

export const userService = {
  register: (data: any) => api.post('/users/register/', data),
  login: (email: string, password: string) =>
    api.post('/users/login/', { email, password }),
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (data: any) => api.patch('/users/profile/', data),
  changePassword: (oldPassword: string, newPassword: string) =>
    api.post('/users/change-password/', { old_password: oldPassword, new_password: newPassword }),
  getAddresses: () => api.get('/users/addresses/'),
  createAddress: (data: any) => api.post('/users/addresses/', data),
  updateAddress: (id: number, data: any) => api.patch(`/users/addresses/${id}/`, data),
  deleteAddress: (id: number) => api.delete(`/users/addresses/${id}/`),
}

export const paymentService = {
  createIntent: (orderNumber: string) =>
    api.post('/payments/create-intent/', { order_number: orderNumber }),
  confirmPayment: (paymentIntentId: string) =>
    api.post('/payments/confirm/', { payment_intent_id: paymentIntentId }),
}

export const contentService = {
  getBanners: (position: string) => api.get('/content/banners/', { params: { position } }),
  getPage: (slug: string) => api.get(`/content/pages/${slug}/`),
  getTestimonials: (brand?: string, featured?: boolean) =>
    api.get('/content/testimonials/', { params: { brand, featured } }),
  getFAQs: (category?: string) => api.get('/content/faq/', { params: { category } }),
  submitContact: (data: any) => api.post('/content/contact/', data),
  subscribeNewsletter: (email: string, name?: string) =>
    api.post('/content/newsletter/', { email, name }),
}

export const coreService = {
  getConfig: () => api.get('/config/'),
  getShippingZones: () => api.get('/shipping-zones/'),
  validateCoupon: (code: string, orderTotal: number, brandType?: string) =>
    api.post('/coupons/validate/', { code, order_total: orderTotal, brand_type: brandType }),
}


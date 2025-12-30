import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hahnemann.gt'
  
  // Static pages
  const staticPages = [
    '',
    '/hahnemann',
    '/mossbaby',
    '/ofertas',
    '/contacto',
    '/faq',
    '/envios',
    '/devoluciones',
    '/terminos',
    '/privacidad',
  ]
  
  const staticRoutes = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly' as const,
    priority: route === '' ? 1 : route.includes('hahnemann') || route.includes('mossbaby') ? 0.9 : 0.7,
  }))
  
  // In production, fetch products from API and add them dynamically
  // const products = await fetchProducts()
  // const productRoutes = products.map((product) => ({
  //   url: `${baseUrl}/producto/${product.slug}`,
  //   lastModified: new Date(product.updated_at),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.8,
  // }))
  
  return [...staticRoutes]
}


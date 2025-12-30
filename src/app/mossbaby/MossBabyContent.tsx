'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiArrowRight, FiFilter, FiHeart } from 'react-icons/fi'
import { ProductCard } from '@/components/product/ProductCard'

// Mock data for Moss Baby products
const mossbabyProducts = [
  {
    id: 2,
    name: 'Extractor de Leche Eléctrico',
    slug: 'extractor-leche-electrico',
    brand: 'mossbaby',
    brandName: 'Moss Baby',
    category: 'Extractores',
    price: 899.00,
    compareAtPrice: null,
    image: '/placeholder.jpg',
    isNew: false,
    isBestseller: true,
    rating: 4.9,
    reviewsCount: 89,
  },
  {
    id: 4,
    name: 'Lonchera Térmica Premium',
    slug: 'lonchera-termica-premium',
    brand: 'mossbaby',
    brandName: 'Moss Baby',
    category: 'Loncheras',
    price: 275.00,
    compareAtPrice: 320.00,
    image: '/placeholder.jpg',
    isNew: true,
    isBestseller: false,
    rating: 4.6,
    reviewsCount: 67,
  },
  {
    id: 7,
    name: 'Set de Biberones Anti-Cólico',
    slug: 'set-biberones-anticolico',
    brand: 'mossbaby',
    brandName: 'Moss Baby',
    category: 'Accesorios',
    price: 350.00,
    compareAtPrice: null,
    image: '/placeholder.jpg',
    isNew: true,
    isBestseller: false,
    rating: 4.7,
    reviewsCount: 34,
  },
  {
    id: 8,
    name: 'Bolsa Térmica para Leche',
    slug: 'bolsa-termica-leche',
    brand: 'mossbaby',
    brandName: 'Moss Baby',
    category: 'Accesorios',
    price: 185.00,
    compareAtPrice: 220.00,
    image: '/placeholder.jpg',
    isNew: false,
    isBestseller: true,
    rating: 4.8,
    reviewsCount: 112,
  },
]

const categories = [
  { name: 'Todos', slug: 'all' },
  { name: 'Extractores', slug: 'extractores' },
  { name: 'Loncheras', slug: 'loncheras' },
  { name: 'Biberones', slug: 'biberones' },
  { name: 'Accesorios', slug: 'accesorios' },
]

export default function MossBabyContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-mossbaby-50 to-cream">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mossbaby opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-mossbaby-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-mossbaby-400/10 blur-3xl" />
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-mossbaby-500/10 text-mossbaby-500 text-sm font-medium mb-4">
              👶 Todo para tu Bebé
            </span>
            <h1 className="heading-1 text-mossbaby-500 mb-4">
              Moss Baby
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              La mejor selección de productos para el cuidado de tu bebé. Extractores de leche, 
              loncheras térmicas, biberones y accesorios de calidad premium.
            </p>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    cat.slug === 'all'
                      ? 'bg-mossbaby-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-mossbaby-50 hover:text-mossbaby-500'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Featured Banner */}
      <section className="container-custom">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-mossbaby-400 to-mossbaby-600 p-8 md:p-12"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                Extractor de Leche #1 en Ventas
              </h3>
              <p className="text-white/80">
                Cómodo, silencioso y ultra eficiente. El favorito de las mamás guatemaltecas.
              </p>
            </div>
            <Link
              href="/producto/extractor-leche-electrico"
              className="btn bg-white text-mossbaby-500 hover:bg-white/90"
            >
              Ver Producto
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </motion.div>
      </section>
      
      {/* Products Grid */}
      <section className="section-padding pt-12">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-600">
              Mostrando <span className="font-semibold">{mossbabyProducts.length}</span> productos
            </p>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full hover:bg-white transition-colors">
              <FiFilter className="w-4 h-4" />
              Filtrar
            </button>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {mossbabyProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Why Moss Baby */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-2 text-charcoal mb-4">
              ¿Por qué elegir Moss Baby?
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🏆',
                title: 'Calidad Premium',
                description: 'Productos certificados y de marcas reconocidas mundialmente.',
              },
              {
                icon: '🛡️',
                title: 'Garantía Extendida',
                description: 'Todos nuestros productos cuentan con garantía de fabricante.',
              },
              {
                icon: '💖',
                title: 'Para Mamás, por Mamás',
                description: 'Selección curada por mamás que entienden tus necesidades.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-mossbaby-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}


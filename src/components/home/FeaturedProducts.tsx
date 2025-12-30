'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { FiShoppingCart, FiHeart, FiEye, FiArrowRight } from 'react-icons/fi'
import { ProductCard } from '@/components/product/ProductCard'

// Temporary mock data
const mockProducts = [
  {
    id: 1,
    name: 'Vitamina C 1000mg',
    slug: 'vitamina-c-1000mg',
    brand: 'hahnemann',
    brandName: 'Hahnemann',
    category: 'Suplementos',
    price: 125.00,
    compareAtPrice: 150.00,
    image: '/placeholder-product.jpg',
    isNew: true,
    isBestseller: false,
    rating: 4.8,
    reviewsCount: 124,
  },
  {
    id: 2,
    name: 'Extractor de Leche Eléctrico',
    slug: 'extractor-leche-electrico',
    brand: 'mossbaby',
    brandName: 'Moss Baby',
    category: 'Extractores',
    price: 899.00,
    compareAtPrice: null,
    image: '/placeholder-product.jpg',
    isNew: false,
    isBestseller: true,
    rating: 4.9,
    reviewsCount: 89,
  },
  {
    id: 3,
    name: 'Multivitamínico Familiar',
    slug: 'multivitaminico-familiar',
    brand: 'hahnemann',
    brandName: 'Hahnemann',
    category: 'Suplementos',
    price: 185.00,
    compareAtPrice: null,
    image: '/placeholder-product.jpg',
    isNew: false,
    isBestseller: true,
    rating: 4.7,
    reviewsCount: 256,
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
    image: '/placeholder-product.jpg',
    isNew: true,
    isBestseller: false,
    rating: 4.6,
    reviewsCount: 67,
  },
]

const tabs = [
  { id: 'all', label: 'Todos' },
  { id: 'hahnemann', label: 'Hahnemann' },
  { id: 'mossbaby', label: 'Moss Baby' },
  { id: 'offers', label: 'Ofertas' },
]

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState('all')
  
  const filteredProducts = mockProducts.filter((product) => {
    if (activeTab === 'all') return true
    if (activeTab === 'offers') return product.compareAtPrice !== null
    return product.brand === activeTab
  })
  
  return (
    <section className="section-padding">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Productos Destacados</span>
            <h2 className="heading-2 mt-2">Lo Mejor para Ti</h2>
          </div>
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-charcoal text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>
        
        {/* Products Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {/* View All Link */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link 
            href="/productos"
            className="btn btn-outline group"
          >
            Ver Todos los Productos
            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}


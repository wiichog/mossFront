'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiArrowRight, FiFilter } from 'react-icons/fi'
import { ProductCard } from '@/components/product/ProductCard'

// Mock data for Hahnemann products
const hahnemannProducts = [
  {
    id: 1,
    name: 'Vitamina C 1000mg',
    slug: 'vitamina-c-1000mg',
    brand: 'hahnemann',
    brandName: 'Hahnemann',
    category: 'Suplementos',
    price: 125.00,
    compareAtPrice: 150.00,
    image: '/placeholder.jpg',
    isNew: true,
    isBestseller: false,
    rating: 4.8,
    reviewsCount: 124,
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
    image: '/placeholder.jpg',
    isNew: false,
    isBestseller: true,
    rating: 4.7,
    reviewsCount: 256,
  },
  {
    id: 5,
    name: 'Omega 3 Premium',
    slug: 'omega-3-premium',
    brand: 'hahnemann',
    brandName: 'Hahnemann',
    category: 'Suplementos',
    price: 220.00,
    compareAtPrice: 250.00,
    image: '/placeholder.jpg',
    isNew: false,
    isBestseller: true,
    rating: 4.9,
    reviewsCount: 89,
  },
  {
    id: 6,
    name: 'Probióticos Digestivos',
    slug: 'probioticos-digestivos',
    brand: 'hahnemann',
    brandName: 'Hahnemann',
    category: 'Digestivo',
    price: 165.00,
    compareAtPrice: null,
    image: '/placeholder.jpg',
    isNew: true,
    isBestseller: false,
    rating: 4.6,
    reviewsCount: 45,
  },
]

const categories = [
  { name: 'Todos', slug: 'all' },
  { name: 'Suplementos', slug: 'suplementos' },
  { name: 'Vitaminas', slug: 'vitaminas' },
  { name: 'Digestivo', slug: 'digestivo' },
  { name: 'Cuidado Personal', slug: 'cuidado-personal' },
]

export default function HahnemannContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-hahnemann-50 to-cream">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hahnemann opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-hahnemann-500/10 blur-3xl" />
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-hahnemann-500/10 text-hahnemann-500 text-sm font-medium mb-4">
              💊 Farmacia de Confianza
            </span>
            <h1 className="heading-1 text-hahnemann-500 mb-4">
              Hahnemann
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Descubre nuestra línea completa de productos farmacéuticos. Suplementos, 
              vitaminas y artículos de cuidado personal de la más alta calidad.
            </p>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    cat.slug === 'all'
                      ? 'bg-hahnemann-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-hahnemann-50 hover:text-hahnemann-500'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Products Grid */}
      <section className="section-padding pt-8">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-600">
              Mostrando <span className="font-semibold">{hahnemannProducts.length}</span> productos
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
            transition={{ staggerChildren: 0.1 }}
          >
            {hahnemannProducts.map((product, index) => (
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
      
      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-hahnemann-500 rounded-3xl p-8 md:p-12 text-white text-center"
          >
            <h2 className="text-3xl font-display font-bold mb-4">
              ¿Necesitas ayuda para elegir?
            </h2>
            <p className="text-white/80 mb-6 max-w-lg mx-auto">
              Nuestro equipo de farmacéuticos está listo para asesorarte. 
              Contáctanos para una consulta personalizada.
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center px-6 py-3 bg-white text-hahnemann-500 rounded-full font-semibold hover:bg-white/90 transition-colors"
            >
              Contactar Asesor
              <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}


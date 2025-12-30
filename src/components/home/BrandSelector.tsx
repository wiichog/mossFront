'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiArrowRight, FiHeart, FiShield } from 'react-icons/fi'

export function BrandSelector() {
  const brands = [
    {
      name: 'Hahnemann',
      tagline: 'Tu farmacia de confianza',
      description: 'Productos farmacéuticos de alta calidad, medicamentos, suplementos y artículos de cuidado personal para toda la familia.',
      href: '/hahnemann',
      icon: '💊',
      gradient: 'from-hahnemann-500 to-hahnemann-600',
      bgGradient: 'from-hahnemann-50 to-hahnemann-100',
      textColor: 'text-hahnemann-500',
      features: ['Medicamentos', 'Suplementos', 'Cuidado Personal'],
    },
    {
      name: 'Moss Baby',
      tagline: 'Todo para tu bebé',
      description: 'La mejor selección de extractores de leche, loncheras, accesorios y productos premium para el cuidado de tu bebé.',
      href: '/mossbaby',
      icon: '👶',
      gradient: 'from-mossbaby-400 to-mossbaby-600',
      bgGradient: 'from-mossbaby-50 to-mossbaby-100',
      textColor: 'text-mossbaby-500',
      features: ['Extractores', 'Loncheras', 'Accesorios'],
    },
  ]
  
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Nuestras Marcas</span>
          <h2 className="heading-2 mt-2">Explora Nuestras Líneas</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Dos marcas, un mismo compromiso: tu bienestar. Descubre productos de calidad 
            para cada etapa de tu vida.
          </p>
        </motion.div>
        
        {/* Brand Cards */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Link href={brand.href} className="group block">
                <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${brand.bgGradient} p-8 md:p-10 transition-all duration-500 hover:shadow-2xl`}>
                  {/* Decorative Background */}
                  <div className={`absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br ${brand.gradient} opacity-10 blur-3xl transform translate-x-20 -translate-y-20 group-hover:opacity-20 transition-opacity`} />
                  
                  {/* Icon */}
                  <motion.div 
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${brand.gradient} shadow-lg flex items-center justify-center mb-6`}
                    whileHover={{ scale: 1.05, rotate: 5 }}
                  >
                    <span className="text-4xl">{brand.icon}</span>
                  </motion.div>
                  
                  {/* Content */}
                  <h3 className={`heading-3 ${brand.textColor} mb-2`}>
                    {brand.name}
                  </h3>
                  <p className="text-gray-600 font-medium mb-4">
                    {brand.tagline}
                  </p>
                  <p className="text-gray-500 mb-6">
                    {brand.description}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {brand.features.map((feature) => (
                      <span 
                        key={feature}
                        className={`px-3 py-1 rounded-full text-sm font-medium bg-white/80 ${brand.textColor}`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  {/* CTA */}
                  <div className={`inline-flex items-center font-medium ${brand.textColor} group-hover:translate-x-2 transition-transform`}>
                    Explorar {brand.name}
                    <FiArrowRight className="ml-2" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


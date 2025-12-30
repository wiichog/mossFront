'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiArrowRight, FiPlay } from 'react-icons/fi'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-50" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream/80 to-transparent" />
      
      {/* Floating Elements */}
      <motion.div 
        className="absolute top-20 right-20 w-72 h-72 rounded-full bg-hahnemann-500/10 blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div 
        className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-mossbaby-500/10 blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <div className="container-custom relative z-10 pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span 
              className="inline-flex items-center px-4 py-2 rounded-full bg-hahnemann-500/10 text-hahnemann-500 text-sm font-medium mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              ✨ Envío gratis en pedidos mayores a Q500
            </motion.span>
            
            <h1 className="heading-1 mb-6">
              <span className="block">Cuidamos tu</span>
              <span className="text-gradient-hahnemann">salud</span>
              <span className="block">y la de tu</span>
              <span className="text-gradient-mossbaby">familia</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-xl">
              Descubre nuestra selección de productos farmacéuticos Hahnemann y artículos 
              premium para bebé Moss Baby. Calidad y confianza para toda Guatemala.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/hahnemann" className="btn btn-primary group">
                Explorar Hahnemann
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/mossbaby" className="btn btn-secondary group">
                Descubrir Moss Baby
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-gray-200">
              {[
                { value: '10K+', label: 'Clientes Felices' },
                { value: '500+', label: 'Productos' },
                { value: '100%', label: 'Garantizado' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <span className="block text-3xl font-bold text-charcoal">{stat.value}</span>
                  <span className="text-sm text-gray-500">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Hero Image/Illustration */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Main Circle */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-hahnemann-100 to-mossbaby-100 animate-float" />
              
              {/* Decorative Elements */}
              <motion.div 
                className="absolute top-10 right-10 w-20 h-20 rounded-2xl bg-hahnemann-500 shadow-xl flex items-center justify-center"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <span className="text-3xl">💊</span>
              </motion.div>
              
              <motion.div 
                className="absolute bottom-10 left-10 w-24 h-24 rounded-2xl bg-mossbaby-500 shadow-xl flex items-center justify-center"
                animate={{ rotate: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              >
                <span className="text-4xl">👶</span>
              </motion.div>
              
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-white shadow-2xl flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="text-center">
                  <span className="block text-5xl mb-2">🏥</span>
                  <span className="text-sm font-medium text-gray-600">Tu bienestar</span>
                </div>
              </motion.div>
              
              {/* Additional floating elements */}
              <motion.div 
                className="absolute top-20 left-0 w-12 h-12 rounded-full bg-amber-400 shadow-lg flex items-center justify-center"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-xl">⭐</span>
              </motion.div>
              
              <motion.div 
                className="absolute bottom-32 right-0 w-14 h-14 rounded-full bg-emerald-400 shadow-lg flex items-center justify-center"
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <span className="text-2xl">🌿</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-gray-400 flex justify-center pt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        </div>
      </motion.div>
    </section>
  )
}


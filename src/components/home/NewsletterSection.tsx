'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiCheck, FiArrowRight } from 'react-icons/fi'
import toast from 'react-hot-toast'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Por favor ingresa tu email')
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubscribed(true)
    toast.success('¡Gracias por suscribirte!')
  }
  
  return (
    <section className="section-padding">
      <div className="container-custom">
        <motion.div 
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-hahnemann-500 via-hahnemann-600 to-mossbaby-500 p-8 md:p-12 lg:p-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-hero-pattern opacity-10" />
          
          {/* Floating Elements */}
          <motion.div 
            className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/10"
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-white/10"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          />
          
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            {/* Icon */}
            <motion.div 
              className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6"
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <FiMail className="w-8 h-8 text-white" />
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Suscríbete y Obtén 10% de Descuento
            </h2>
            
            <p className="text-white/80 mb-8 max-w-md mx-auto">
              Recibe ofertas exclusivas, nuevos productos y consejos de salud 
              directamente en tu bandeja de entrada.
            </p>
            
            {isSubscribed ? (
              <motion.div 
                className="flex items-center justify-center gap-3 text-white"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <FiCheck className="w-6 h-6 text-hahnemann-500" />
                </div>
                <span className="text-lg font-medium">¡Gracias por suscribirte!</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="flex-1 px-5 py-4 rounded-full bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 rounded-full bg-white text-hahnemann-500 font-semibold hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-hahnemann-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Suscribirme
                      <FiArrowRight />
                    </>
                  )}
                </button>
              </form>
            )}
            
            <p className="text-white/60 text-sm mt-4">
              Sin spam, solo contenido de valor. Puedes cancelar cuando quieras.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


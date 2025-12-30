'use client'

import { motion } from 'framer-motion'
import { FiTruck, FiShield, FiHeart, FiRefreshCw, FiHeadphones, FiCreditCard } from 'react-icons/fi'

const benefits = [
  {
    icon: FiTruck,
    title: 'Envío Rápido',
    description: 'Entrega a todo Guatemala en 1-5 días hábiles',
    color: 'bg-emerald-500',
  },
  {
    icon: FiShield,
    title: 'Pago Seguro',
    description: 'Transacciones protegidas con encriptación SSL',
    color: 'bg-blue-500',
  },
  {
    icon: FiRefreshCw,
    title: 'Devolución Fácil',
    description: '30 días para devoluciones sin complicaciones',
    color: 'bg-amber-500',
  },
  {
    icon: FiHeadphones,
    title: 'Soporte 24/7',
    description: 'Atención al cliente siempre disponible',
    color: 'bg-purple-500',
  },
  {
    icon: FiHeart,
    title: 'Calidad Premium',
    description: 'Productos certificados y de alta calidad',
    color: 'bg-rose-500',
  },
  {
    icon: FiCreditCard,
    title: 'Múltiples Pagos',
    description: 'Tarjeta, transferencia o efectivo contra entrega',
    color: 'bg-teal-500',
  },
]

export function BenefitsSection() {
  return (
    <section className="section-padding bg-charcoal text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-5" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-hahnemann-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-mossbaby-500/20 blur-3xl" />
      
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">¿Por qué elegirnos?</span>
          <h2 className="heading-2 mt-2 text-white">Tu Satisfacción es Nuestra Prioridad</h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Nos esforzamos por brindarte la mejor experiencia de compra con beneficios 
            diseñados para tu comodidad y tranquilidad.
          </p>
        </motion.div>
        
        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:border-white/20">
                <div className={`w-14 h-14 rounded-xl ${benefit.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-400">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


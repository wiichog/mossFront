'use client'

import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const testimonials = [
  {
    id: 1,
    name: 'María García',
    title: 'Mamá primeriza',
    content: 'El extractor de leche de Moss Baby ha sido una bendición. La calidad es excelente y el servicio al cliente es increíble. ¡100% recomendado!',
    rating: 5,
    brand: 'mossbaby',
  },
  {
    id: 2,
    name: 'Carlos Mendoza',
    title: 'Cliente frecuente',
    content: 'Compro mis vitaminas y suplementos en Hahnemann desde hace años. Los precios son competitivos y siempre llegan a tiempo.',
    rating: 5,
    brand: 'hahnemann',
  },
  {
    id: 3,
    name: 'Ana Lucía Pérez',
    title: 'Madre de dos',
    content: 'La lonchera térmica mantiene los alimentos de mis hijos frescos todo el día. Excelente inversión para la escuela.',
    rating: 5,
    brand: 'mossbaby',
  },
  {
    id: 4,
    name: 'Roberto Juárez',
    title: 'Deportista',
    content: 'Los suplementos de Hahnemann me han ayudado mucho en mi rendimiento. Son de excelente calidad y a buen precio.',
    rating: 4,
    brand: 'hahnemann',
  },
]

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-gradient-to-b from-cream to-white">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Testimonios</span>
          <h2 className="heading-2 mt-2">Lo Que Dicen Nuestros Clientes</h2>
        </motion.div>
        
        {/* Testimonials Slider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  const brandColor = testimonial.brand === 'mossbaby' ? 'text-mossbaby-500' : 'text-hahnemann-500'
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg h-full flex flex-col">
      {/* Rating */}
      <div className="flex text-amber-400 mb-4">
        {[...Array(5)].map((_, i) => (
          <FiStar 
            key={i} 
            className={`w-5 h-5 ${i < testimonial.rating ? 'fill-current' : ''}`} 
          />
        ))}
      </div>
      
      {/* Content */}
      <p className="text-gray-600 flex-grow mb-6">
        "{testimonial.content}"
      </p>
      
      {/* Author */}
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-full ${testimonial.brand === 'mossbaby' ? 'bg-mossbaby-100' : 'bg-hahnemann-100'} flex items-center justify-center`}>
          <span className="text-xl">
            {testimonial.brand === 'mossbaby' ? '👶' : '💊'}
          </span>
        </div>
        <div className="ml-3">
          <h4 className="font-semibold text-charcoal">{testimonial.name}</h4>
          <p className={`text-sm ${brandColor}`}>{testimonial.title}</p>
        </div>
      </div>
    </div>
  )
}


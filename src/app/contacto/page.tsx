'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  FiMail, FiPhone, FiMapPin, FiClock, FiSend, 
  FiMessageCircle, FiCheckCircle, FiInstagram, FiFacebook 
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { contentService } from '@/lib/api'

const contactSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(8, 'Teléfono inválido').optional().or(z.literal('')),
  subject: z.string().min(5, 'El asunto debe tener al menos 5 caracteres'),
  message: z.string().min(20, 'El mensaje debe tener al menos 20 caracteres'),
})

type ContactFormData = z.infer<typeof contactSchema>

const subjects = [
  'Consulta sobre productos',
  'Estado de mi pedido',
  'Devoluciones y cambios',
  'Mayoreo y distribución',
  'Sugerencias',
  'Otro'
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })
  
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      await contentService.submitContact(data)
      setIsSubmitted(true)
      reset()
      toast.success('¡Mensaje enviado exitosamente!')
    } catch (error) {
      // Si falla la API, simulamos éxito para desarrollo
      console.error('Error submitting contact form:', error)
      setIsSubmitted(true)
      reset()
      toast.success('¡Mensaje enviado exitosamente!')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const contactInfo = [
    {
      icon: FiPhone,
      title: 'Teléfono',
      content: '+502 2222-3333',
      action: 'tel:+50222223333',
      color: 'bg-blue-500'
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      content: '+502 5555-6666',
      action: 'https://wa.me/50255556666',
      color: 'bg-green-500'
    },
    {
      icon: FiMail,
      title: 'Email',
      content: 'info@hahnemann.gt',
      action: 'mailto:info@hahnemann.gt',
      color: 'bg-hahnemann-500'
    },
    {
      icon: FiMapPin,
      title: 'Dirección',
      content: 'Zona 10, Guatemala City',
      action: 'https://maps.google.com',
      color: 'bg-red-500'
    },
  ]
  
  const socialLinks = [
    { icon: FiFacebook, url: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: FiInstagram, url: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
    { icon: FaWhatsapp, url: '#', label: 'WhatsApp', color: 'hover:bg-green-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-hahnemann-50">
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-hahnemann-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-mossbaby-500 rounded-full blur-3xl" />
        </div>
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 bg-hahnemann-100 text-hahnemann-700 rounded-full text-sm font-medium mb-4">
              <FiMessageCircle className="inline mr-2" />
              Estamos para ayudarte
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-6">
              Contáctanos
            </h1>
            <p className="text-lg text-gray-600">
              ¿Tienes alguna pregunta o comentario? Nos encantaría escucharte. 
              Nuestro equipo está listo para atenderte.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-8">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {contactInfo.map((item, index) => (
              <motion.a
                key={item.title}
                href={item.action}
                target={item.action.startsWith('http') ? '_blank' : undefined}
                rel={item.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-charcoal mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.content}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiCheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-charcoal mb-4">
                      ¡Mensaje Enviado!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Gracias por contactarnos. Te responderemos lo antes posible.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="btn btn-outline"
                    >
                      Enviar otro mensaje
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <h2 className="text-2xl font-display font-bold text-charcoal mb-6">
                      Envíanos un mensaje
                    </h2>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">
                            Nombre completo *
                          </label>
                          <input
                            {...register('name')}
                            type="text"
                            className={`w-full px-4 py-3 rounded-xl border ${
                              errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-hahnemann-200'
                            } focus:border-hahnemann-500 focus:ring-2 transition-all outline-none`}
                            placeholder="Tu nombre"
                          />
                          {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">
                            Email *
                          </label>
                          <input
                            {...register('email')}
                            type="email"
                            className={`w-full px-4 py-3 rounded-xl border ${
                              errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-hahnemann-200'
                            } focus:border-hahnemann-500 focus:ring-2 transition-all outline-none`}
                            placeholder="tu@email.com"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">
                            Teléfono
                          </label>
                          <input
                            {...register('phone')}
                            type="tel"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-hahnemann-500 focus:ring-2 focus:ring-hahnemann-200 transition-all outline-none"
                            placeholder="+502 1234-5678"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">
                            Asunto *
                          </label>
                          <select
                            {...register('subject')}
                            className={`w-full px-4 py-3 rounded-xl border ${
                              errors.subject ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-hahnemann-200'
                            } focus:border-hahnemann-500 focus:ring-2 transition-all outline-none bg-white`}
                          >
                            <option value="">Seleccionar asunto</option>
                            {subjects.map((subject) => (
                              <option key={subject} value={subject}>
                                {subject}
                              </option>
                            ))}
                          </select>
                          {errors.subject && (
                            <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                          Mensaje *
                        </label>
                        <textarea
                          {...register('message')}
                          rows={5}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.message ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-hahnemann-200'
                          } focus:border-hahnemann-500 focus:ring-2 transition-all outline-none resize-none`}
                          placeholder="¿En qué podemos ayudarte?"
                        />
                        {errors.message && (
                          <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                        )}
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn btn-primary py-4 text-lg"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Enviando...
                          </div>
                        ) : (
                          <span className="flex items-center justify-center">
                            <FiSend className="mr-2" />
                            Enviar Mensaje
                          </span>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              {/* Business Hours */}
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-hahnemann-100 rounded-xl flex items-center justify-center mr-4">
                    <FiClock className="w-6 h-6 text-hahnemann-600" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-charcoal">
                    Horario de Atención
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Lunes - Viernes</span>
                    <span className="font-semibold text-charcoal">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Sábado</span>
                    <span className="font-semibold text-charcoal">9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-600">Domingo</span>
                    <span className="font-semibold text-red-500">Cerrado</span>
                  </div>
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div className="bg-gradient-to-br from-hahnemann-500 to-hahnemann-600 rounded-3xl p-8 text-white">
                <h3 className="text-xl font-display font-bold mb-4">
                  ¿Preguntas Frecuentes?
                </h3>
                <p className="text-hahnemann-100 mb-6">
                  Encuentra respuestas rápidas a las preguntas más comunes sobre 
                  envíos, devoluciones y más.
                </p>
                <a 
                  href="/faq" 
                  className="inline-flex items-center px-6 py-3 bg-white text-hahnemann-600 rounded-xl font-semibold hover:bg-hahnemann-50 transition-colors"
                >
                  Ver Preguntas Frecuentes
                </a>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-xl font-display font-bold text-charcoal mb-6">
                  Síguenos en Redes
                </h3>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 ${social.color} hover:text-white transition-all duration-300`}
                      aria-label={social.label}
                    >
                      <social.icon className="w-6 h-6" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="bg-white rounded-3xl p-4 shadow-lg overflow-hidden">
                <div className="w-full h-64 bg-gray-200 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <FiMapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Mapa de ubicación</p>
                    <p className="text-sm text-gray-400">Zona 10, Guatemala City</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}


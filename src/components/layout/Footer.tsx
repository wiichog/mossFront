'use client'

import Link from 'next/link'
import { FiFacebook, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { motion } from 'framer-motion'

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  const footerLinks = {
    hahnemann: [
      { href: '/hahnemann', label: 'Todos los Productos' },
      { href: '/hahnemann/medicamentos', label: 'Medicamentos' },
      { href: '/hahnemann/suplementos', label: 'Suplementos' },
      { href: '/hahnemann/cuidado-personal', label: 'Cuidado Personal' },
    ],
    mossbaby: [
      { href: '/mossbaby', label: 'Todos los Productos' },
      { href: '/mossbaby/extractores', label: 'Extractores' },
      { href: '/mossbaby/loncheras', label: 'Loncheras' },
      { href: '/mossbaby/accesorios', label: 'Accesorios' },
    ],
    ayuda: [
      { href: '/faq', label: 'Preguntas Frecuentes' },
      { href: '/envios', label: 'Envíos' },
      { href: '/devoluciones', label: 'Devoluciones' },
      { href: '/rastrear-pedido', label: 'Rastrear Pedido' },
    ],
    legal: [
      { href: '/terminos', label: 'Términos y Condiciones' },
      { href: '/privacidad', label: 'Política de Privacidad' },
      { href: '/cookies', label: 'Cookies' },
    ],
  }
  
  return (
    <footer className="bg-charcoal text-white">
      {/* Main Footer */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-hahnemann-500 to-mossbaby-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">H</span>
                </div>
                <div className="ml-3">
                  <span className="font-display text-xl font-bold block">Hahnemann & Moss Baby</span>
                  <span className="text-gray-400 text-sm">Tu salud y bienestar, nuestra prioridad</span>
                </div>
              </div>
            </Link>
            
            <p className="text-gray-400 mb-6 max-w-md">
              Somos una empresa guatemalteca comprometida con la salud y el bienestar de las familias. 
              Ofrecemos productos farmacéuticos de calidad y artículos para bebé.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-gray-400">
              <a href="tel:+50212345678" className="flex items-center hover:text-white transition-colors">
                <FiPhone className="w-5 h-5 mr-3" />
                +502 1234-5678
              </a>
              <a href="mailto:info@hahnemann.gt" className="flex items-center hover:text-white transition-colors">
                <FiMail className="w-5 h-5 mr-3" />
                info@hahnemann.gt
              </a>
              <div className="flex items-start">
                <FiMapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                <span>Ciudad de Guatemala, Guatemala</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {[
                { icon: FiFacebook, href: '#', label: 'Facebook' },
                { icon: FiInstagram, href: '#', label: 'Instagram' },
                { icon: FiYoutube, href: '#', label: 'YouTube' },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-hahnemann-500 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
          
          {/* Hahnemann Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-hahnemann-400">Hahnemann</h4>
            <ul className="space-y-2">
              {footerLinks.hahnemann.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Moss Baby Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-mossbaby-400">Moss Baby</h4>
            <ul className="space-y-2">
              {footerLinks.mossbaby.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Help Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Ayuda</h4>
            <ul className="space-y-2">
              {footerLinks.ayuda.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Hahnemann & Moss Baby. Todos los derechos reservados.
          </p>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {footerLinks.legal.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="text-gray-400 text-sm hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Payment Methods */}
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <span className="text-gray-500 text-sm">Pagos seguros:</span>
            <div className="flex space-x-2">
              <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-xs font-bold">VISA</div>
              <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-xs font-bold">MC</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


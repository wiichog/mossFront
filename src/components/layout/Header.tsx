'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiHeart } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'
import { SearchModal } from '@/components/ui/SearchModal'
import { CartDrawer } from '@/components/cart/CartDrawer'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  const cartItems = useCartStore((state) => state.totalItems)
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/hahnemann', label: 'Hahnemann', className: 'text-hahnemann-500 hover:text-hahnemann-600' },
    { href: '/mossbaby', label: 'Moss Baby', className: 'text-mossbaby-500 hover:text-mossbaby-600' },
    { href: '/ofertas', label: 'Ofertas' },
    { href: '/contacto', label: 'Contacto' },
  ]
  
  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass shadow-lg py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-hahnemann-500 to-mossbaby-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <div className="ml-2 hidden sm:block">
                  <span className="font-display text-xl font-bold">
                    <span className="text-hahnemann-500">Hahnemann</span>
                    <span className="text-gray-400 mx-1">&</span>
                    <span className="text-mossbaby-500">Moss Baby</span>
                  </span>
                </div>
              </motion.div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium transition-colors hover:text-hahnemann-500 ${link.className || ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            
            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Buscar"
              >
                <FiSearch className="w-5 h-5" />
              </button>
              
              <Link 
                href="/perfil?tab=wishlist"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors hidden sm:flex"
                aria-label="Favoritos"
              >
                <FiHeart className="w-5 h-5" />
              </Link>
              
              <Link 
                href="/perfil"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors hidden sm:flex"
                aria-label="Mi Perfil"
              >
                <FiUser className="w-5 h-5" />
              </Link>
              
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Carrito"
              >
                <FiShoppingCart className="w-5 h-5" />
                {cartItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-mossbaby-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                  >
                    {cartItems}
                  </motion.span>
                )}
              </button>
              
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Menú"
              >
                {isMobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden glass border-t mt-2"
            >
              <nav className="container-custom py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-2 font-medium ${link.className || 'hover:text-hahnemann-500'}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="my-2" />
                <Link
                  href="/perfil"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center py-2 font-medium hover:text-hahnemann-500"
                >
                  <FiUser className="w-5 h-5 mr-2" />
                  Mi Perfil
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}


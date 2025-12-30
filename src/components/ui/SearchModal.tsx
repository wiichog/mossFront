'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiX, FiArrowRight } from 'react-icons/fi'
import Link from 'next/link'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      setQuery('')
      setResults([])
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])
  
  // Mock search - In production, debounce and call API
  useEffect(() => {
    if (query.length >= 2) {
      // Simulate search results
      setResults([
        { id: 1, name: 'Vitamina C 1000mg', brand: 'Hahnemann', href: '/producto/vitamina-c' },
        { id: 2, name: 'Extractor de Leche', brand: 'Moss Baby', href: '/producto/extractor' },
        { id: 3, name: 'Multivitamínico', brand: 'Hahnemann', href: '/producto/multivitaminico' },
      ].filter(p => p.name.toLowerCase().includes(query.toLowerCase())))
    } else {
      setResults([])
    }
  }, [query])
  
  const popularSearches = ['Vitaminas', 'Extractores', 'Suplementos', 'Loncheras']
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-50 p-4 md:p-8"
          >
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="relative">
                <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full px-14 py-5 text-lg focus:outline-none"
                />
                <button
                  onClick={onClose}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <hr />
              
              {/* Results or Popular Searches */}
              <div className="max-h-96 overflow-y-auto">
                {query.length >= 2 && results.length > 0 ? (
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Resultados</h3>
                    <div className="space-y-2">
                      {results.map((result) => (
                        <Link
                          key={result.id}
                          href={result.href}
                          onClick={onClose}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <div>
                            <span className="font-medium text-charcoal">{result.name}</span>
                            <span className="text-sm text-gray-500 ml-2">{result.brand}</span>
                          </div>
                          <FiArrowRight className="text-gray-400" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : query.length >= 2 && results.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p>No se encontraron resultados para "{query}"</p>
                  </div>
                ) : (
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Búsquedas populares</h3>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-4 bg-gray-50 text-center text-sm text-gray-500">
                Presiona <kbd className="px-2 py-1 rounded bg-gray-200 text-xs">ESC</kbd> para cerrar
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}


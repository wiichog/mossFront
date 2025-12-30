'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiHeart, FiEye, FiStar } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

interface Product {
  id: number
  name: string
  slug: string
  brand: string
  brandName: string
  category: string
  price: number
  compareAtPrice: number | null
  image: string
  isNew?: boolean
  isBestseller?: boolean
  rating?: number
  reviewsCount?: number
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  
  const isOnSale = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercentage = isOnSale 
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0
  
  const brandColors = {
    hahnemann: {
      badge: 'bg-hahnemann-500',
      accent: 'text-hahnemann-500',
      hover: 'group-hover:bg-hahnemann-500',
    },
    mossbaby: {
      badge: 'bg-mossbaby-500',
      accent: 'text-mossbaby-500',
      hover: 'group-hover:bg-mossbaby-500',
    },
  }
  
  const colors = brandColors[product.brand as keyof typeof brandColors] || brandColors.hahnemann
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price,
      quantity: 1,
    })
    
    toast.success(`${product.name} agregado al carrito`)
  }
  
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
    toast.success(isLiked ? 'Eliminado de favoritos' : 'Agregado a favoritos')
  }
  
  return (
    <motion.div
      className="group card card-hover overflow-hidden"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/producto/${product.slug}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {/* Placeholder image - In production, use actual images */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-6xl opacity-50">
              {product.brand === 'mossbaby' ? '👶' : '💊'}
            </span>
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isOnSale && (
              <span className="badge badge-sale">
                -{discountPercentage}%
              </span>
            )}
            {product.isNew && (
              <span className="badge badge-new">
                Nuevo
              </span>
            )}
            {product.isBestseller && (
              <span className="badge badge-bestseller">
                ⭐ Popular
              </span>
            )}
          </div>
          
          {/* Brand Badge */}
          <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-white text-xs font-medium ${colors.badge}`}>
            {product.brandName}
          </div>
          
          {/* Quick Actions */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 p-3 flex justify-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          >
            <button
              onClick={handleLike}
              className={`w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
            >
              <FiHeart className={isLiked ? 'fill-current' : ''} />
            </button>
            <button
              onClick={handleAddToCart}
              className={`flex-1 max-w-[160px] h-10 rounded-full bg-white shadow-lg flex items-center justify-center gap-2 text-sm font-medium ${colors.accent} hover:bg-gray-50 transition-colors`}
            >
              <FiShoppingCart />
              Agregar
            </button>
            <Link
              href={`/producto/${product.slug}`}
              className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiEye />
            </Link>
          </motion.div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <span className={`text-xs font-medium ${colors.accent} uppercase tracking-wider`}>
            {product.category}
          </span>
          
          {/* Name */}
          <h3 className="font-medium text-charcoal mt-1 line-clamp-2 group-hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mt-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <FiStar 
                    key={i} 
                    className={`w-3.5 h-3.5 ${i < Math.floor(product.rating!) ? 'fill-current' : ''}`} 
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviewsCount})
              </span>
            </div>
          )}
          
          {/* Price */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-lg font-bold text-charcoal">
              Q{product.price.toFixed(2)}
            </span>
            {isOnSale && (
              <span className="text-sm text-gray-400 line-through">
                Q{product.compareAtPrice!.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}


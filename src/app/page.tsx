'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { FiArrowRight, FiTruck, FiShield, FiHeart, FiStar } from 'react-icons/fi'
import { HeroSection } from '@/components/home/HeroSection'
import { BrandSelector } from '@/components/home/BrandSelector'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { BenefitsSection } from '@/components/home/BenefitsSection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { NewsletterSection } from '@/components/home/NewsletterSection'

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Brand Selector */}
      <BrandSelector />
      
      {/* Featured Products */}
      <FeaturedProducts />
      
      {/* Benefits */}
      <BenefitsSection />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Newsletter */}
      <NewsletterSection />
    </div>
  )
}


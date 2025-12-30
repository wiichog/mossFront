import { Metadata } from 'next'
import HahnemannContent from './HahnemannContent'

export const metadata: Metadata = {
  title: 'Hahnemann - Productos Farmacéuticos y Suplementos',
  description: 'Descubre nuestra línea completa de productos farmacéuticos Hahnemann. Vitaminas, suplementos, medicamentos naturales y artículos de cuidado personal. Envíos a toda Guatemala.',
  keywords: ['farmacia Hahnemann', 'vitaminas Guatemala', 'suplementos', 'medicamentos naturales', 'cuidado personal'],
  openGraph: {
    title: 'Hahnemann - Productos Farmacéuticos y Suplementos',
    description: 'Tu farmacia de confianza. Vitaminas, suplementos y productos de cuidado personal de alta calidad.',
    images: ['/og-hahnemann.jpg'],
  },
}

export default function HahnemannPage() {
  return <HahnemannContent />
}

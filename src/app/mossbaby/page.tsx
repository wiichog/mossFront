import { Metadata } from 'next'
import MossBabyContent from './MossBabyContent'

export const metadata: Metadata = {
  title: 'Moss Baby - Productos Premium para Bebé',
  description: 'La mejor selección de productos para el cuidado de tu bebé. Extractores de leche eléctricos, loncheras térmicas, biberones anti-cólico y accesorios de calidad premium.',
  keywords: ['productos para bebé', 'extractor de leche Guatemala', 'loncheras térmicas', 'biberones', 'Moss Baby', 'artículos bebé'],
  openGraph: {
    title: 'Moss Baby - Productos Premium para Bebé',
    description: 'Todo lo que tu bebé necesita. Extractores de leche, loncheras térmicas y accesorios premium.',
    images: ['/og-mossbaby.jpg'],
  },
}

export default function MossBabyPage() {
  return <MossBabyContent />
}

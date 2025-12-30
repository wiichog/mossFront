'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FiArrowLeft, FiLock, FiTruck, FiCreditCard, FiCheck } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

const checkoutSchema = z.object({
  // Contact
  email: z.string().email('Email inválido'),
  phone: z.string().min(8, 'Teléfono inválido'),
  
  // Shipping
  fullName: z.string().min(3, 'Nombre completo requerido'),
  address1: z.string().min(5, 'Dirección requerida'),
  address2: z.string().optional(),
  city: z.string().min(2, 'Ciudad requerida'),
  department: z.string().min(2, 'Departamento requerido'),
  postalCode: z.string().optional(),
  deliveryInstructions: z.string().optional(),
  
  // Billing (optional)
  billingName: z.string().optional(),
  billingNit: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

const departments = [
  'Guatemala', 'Sacatepéquez', 'Escuintla', 'Chimaltenango',
  'Quetzaltenango', 'Alta Verapaz', 'Petén', 'Izabal', 'Otros'
]

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const { items, subtotal, clearCart } = useCartStore()
  
  const shipping = subtotal >= 500 ? 0 : 35
  const total = subtotal + shipping
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })
  
  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true)
    
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    // In production, create order and redirect to payment
    toast.success('¡Pedido creado exitosamente!')
    clearCart()
    setStep(3)
    setIsProcessing(false)
  }
  
  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream pt-24">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <FiTruck className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-display font-bold text-charcoal mb-2">
            Tu carrito está vacío
          </h1>
          <p className="text-gray-600 mb-6">
            Agrega productos para continuar con tu compra
          </p>
          <Link href="/" className="btn btn-primary">
            Ir a la Tienda
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-cream pt-24 pb-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-charcoal mb-4">
            <FiArrowLeft className="mr-2" />
            Volver a la tienda
          </Link>
          <h1 className="text-3xl font-display font-bold text-charcoal">Checkout</h1>
        </div>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {['Información', 'Pago', 'Confirmación'].map((label, index) => (
            <div key={label} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step > index + 1 ? 'bg-hahnemann-500 text-white' :
                step === index + 1 ? 'bg-hahnemann-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > index + 1 ? <FiCheck /> : index + 1}
              </div>
              <span className={`ml-2 ${step >= index + 1 ? 'text-charcoal' : 'text-gray-400'}`}>
                {label}
              </span>
              {index < 2 && (
                <div className={`w-16 h-0.5 mx-4 ${step > index + 1 ? 'bg-hahnemann-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        
        {step === 3 ? (
          // Confirmation Step
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="w-20 h-20 rounded-full bg-hahnemann-500 flex items-center justify-center mx-auto mb-6">
              <FiCheck className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-charcoal mb-4">
              ¡Pedido Confirmado!
            </h2>
            <p className="text-gray-600 mb-6">
              Gracias por tu compra. Te hemos enviado un email con los detalles de tu pedido.
            </p>
            <p className="text-lg font-semibold text-hahnemann-500 mb-8">
              Número de orden: #HM2024XXXXXX
            </p>
            <Link href="/" className="btn btn-primary">
              Seguir Comprando
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)}>
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    {/* Contact Info */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-charcoal mb-4">
                        Información de Contacto
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="label">Email</label>
                          <input
                            {...register('email')}
                            type="email"
                            className="input"
                            placeholder="tu@email.com"
                          />
                          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                          <label className="label">Teléfono</label>
                          <input
                            {...register('phone')}
                            type="tel"
                            className="input"
                            placeholder="+502 1234-5678"
                          />
                          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                        </div>
                      </div>
                    </div>
                    
                    {/* Shipping Info */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-charcoal mb-4">
                        Dirección de Envío
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="label">Nombre Completo</label>
                          <input
                            {...register('fullName')}
                            className="input"
                            placeholder="Juan Pérez"
                          />
                          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                        </div>
                        <div>
                          <label className="label">Dirección</label>
                          <input
                            {...register('address1')}
                            className="input"
                            placeholder="Calle, número, zona"
                          />
                          {errors.address1 && <p className="text-red-500 text-sm mt-1">{errors.address1.message}</p>}
                        </div>
                        <div>
                          <label className="label">Dirección Línea 2 (Opcional)</label>
                          <input
                            {...register('address2')}
                            className="input"
                            placeholder="Edificio, apartamento, etc."
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="label">Ciudad/Municipio</label>
                            <input
                              {...register('city')}
                              className="input"
                              placeholder="Guatemala"
                            />
                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                          </div>
                          <div>
                            <label className="label">Departamento</label>
                            <select {...register('department')} className="input">
                              <option value="">Seleccionar...</option>
                              {departments.map((dep) => (
                                <option key={dep} value={dep}>{dep}</option>
                              ))}
                            </select>
                            {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>}
                          </div>
                        </div>
                        <div>
                          <label className="label">Instrucciones de Entrega (Opcional)</label>
                          <textarea
                            {...register('deliveryInstructions')}
                            className="input min-h-[80px]"
                            placeholder="Dejar con el guardia, tocar timbre, etc."
                          />
                        </div>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn btn-primary w-full"
                    >
                      Continuar al Pago
                    </button>
                  </motion.div>
                )}
                
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    {/* Payment */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center">
                        <FiCreditCard className="mr-2" />
                        Método de Pago
                      </h3>
                      
                      <div className="space-y-3">
                        <label className="flex items-center p-4 border border-hahnemann-500 rounded-xl cursor-pointer bg-hahnemann-50">
                          <input type="radio" name="paymentMethod" defaultChecked className="mr-3" />
                          <span className="flex-1">
                            <span className="font-medium">Tarjeta de Crédito/Débito</span>
                            <span className="block text-sm text-gray-500">Visa, Mastercard, American Express</span>
                          </span>
                        </label>
                        <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                          <input type="radio" name="paymentMethod" className="mr-3" />
                          <span className="flex-1">
                            <span className="font-medium">Efectivo contra Entrega</span>
                            <span className="block text-sm text-gray-500">Paga al recibir tu pedido</span>
                          </span>
                        </label>
                      </div>
                      
                      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600 flex items-center">
                          <FiLock className="mr-2 text-hahnemann-500" />
                          Tus datos están protegidos con encriptación SSL
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="btn btn-outline flex-1"
                      >
                        Volver
                      </button>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="btn btn-primary flex-1"
                      >
                        {isProcessing ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            Confirmar Pedido
                            <FiLock className="ml-2" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h3 className="text-lg font-semibold text-charcoal mb-4">
                  Resumen del Pedido
                </h3>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📦</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-charcoal line-clamp-1">{item.name}</p>
                        <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                        <p className="font-semibold text-hahnemann-500">Q{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <hr className="my-4" />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">Q{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío</span>
                    <span className={`font-medium ${shipping === 0 ? 'text-hahnemann-500' : ''}`}>
                      {shipping === 0 ? 'Gratis' : `Q${shipping.toFixed(2)}`}
                    </span>
                  </div>
                </div>
                
                <hr className="my-4" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-hahnemann-500">Q{total.toFixed(2)}</span>
                </div>
                
                {subtotal < 500 && (
                  <p className="text-sm text-gray-500 mt-4">
                    Agrega Q{(500 - subtotal).toFixed(2)} más para envío gratis
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  FiArrowLeft, FiLock, FiTruck, FiCreditCard, FiCheck, 
  FiAlertCircle, FiDollarSign, FiInfo 
} from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'
import { getDepartmentNames, getMunicipalitiesByDepartment } from '@/data/guatemala'
import { orderService, paymentService, CardPaymentData } from '@/lib/api'
import toast from 'react-hot-toast'

// Schema de validación mejorado
const checkoutSchema = z.object({
  // Contact - Validaciones estrictas
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email válido (ejemplo@correo.com)'),
  phone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .regex(/^(\+502\s?)?[0-9]{4}[-\s]?[0-9]{4}$/, 'Formato: +502 1234-5678 o 12345678'),
  
  // Shipping - Validaciones completas
  fullName: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(5, 'Ingresa tu nombre completo (mínimo 5 caracteres)')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),
  address1: z
    .string()
    .min(1, 'La dirección es requerida')
    .min(10, 'La dirección debe tener al menos 10 caracteres'),
  address2: z.string().optional(),
  department: z
    .string()
    .min(1, 'Selecciona un departamento'),
  city: z
    .string()
    .min(1, 'Selecciona un municipio'),
  postalCode: z.string().optional(),
  deliveryInstructions: z.string().optional(),
  
  // Billing (optional but validated if provided)
  billingName: z.string().optional(),
  billingNit: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[0-9]{6,9}[0-9Kk]?$/.test(val.replace(/-/g, '')),
      'NIT inválido (ej: 12345678 o 1234567-K)'
    ),
  
  // Payment method
  paymentMethod: z.enum(['card', 'cash', 'transfer']),
  
  // Card details (only required for card payment)
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpMonth: z.string().optional(),
  cardExpYear: z.string().optional(),
  cardCvv: z.string().optional(),
}).superRefine((data, ctx) => {
  // Validaciones condicionales para pago con tarjeta
  if (data.paymentMethod === 'card') {
    if (!data.cardName || data.cardName.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El nombre en la tarjeta es requerido',
        path: ['cardName'],
      })
    }
    if (!data.cardNumber || !/^[0-9]{16}$/.test(data.cardNumber.replace(/\s/g, ''))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Número de tarjeta inválido (16 dígitos)',
        path: ['cardNumber'],
      })
    }
    if (!data.cardExpMonth || !data.cardExpYear) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Fecha de expiración requerida',
        path: ['cardExpMonth'],
      })
    }
    if (!data.cardCvv || !/^[0-9]{3,4}$/.test(data.cardCvv)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CVV inválido (3-4 dígitos)',
        path: ['cardCvv'],
      })
    }
  }
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

const departments = getDepartmentNames()

const months = [
  { value: '01', label: '01 - Enero' },
  { value: '02', label: '02 - Febrero' },
  { value: '03', label: '03 - Marzo' },
  { value: '04', label: '04 - Abril' },
  { value: '05', label: '05 - Mayo' },
  { value: '06', label: '06 - Junio' },
  { value: '07', label: '07 - Julio' },
  { value: '08', label: '08 - Agosto' },
  { value: '09', label: '09 - Septiembre' },
  { value: '10', label: '10 - Octubre' },
  { value: '11', label: '11 - Noviembre' },
  { value: '12', label: '12 - Diciembre' },
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 10 }, (_, i) => ({
  value: String(currentYear + i).slice(-2),
  label: String(currentYear + i),
}))

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const { items, subtotal, clearCart } = useCartStore()
  
  const shipping = subtotal >= 500 ? 0 : 35
  const total = subtotal + shipping
  
  const municipalities = getMunicipalitiesByDepartment(selectedDepartment)
  
  const { 
    register, 
    handleSubmit, 
    control,
    formState: { errors, isValid, touchedFields }, 
    watch,
    setValue,
    trigger,
    getValues
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onBlur',
    defaultValues: {
      paymentMethod: 'card',
    }
  })
  
  const paymentMethod = watch('paymentMethod')
  const watchDepartment = watch('department')
  
  // Actualizar municipios cuando cambia el departamento
  useEffect(() => {
    if (watchDepartment !== selectedDepartment) {
      setSelectedDepartment(watchDepartment)
      setValue('city', '')
    }
  }, [watchDepartment, selectedDepartment, setValue])
  
  // Validar paso 1 antes de continuar
  const handleContinueToPayment = async () => {
    const step1Fields: (keyof CheckoutFormData)[] = [
      'email', 'phone', 'fullName', 'address1', 'department', 'city'
    ]
    
    const isStep1Valid = await trigger(step1Fields)
    
    if (isStep1Valid) {
      setStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      toast.error('Por favor completa todos los campos requeridos')
    }
  }
  
  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true)
    
    try {
      // 1. Crear la orden
      const orderData = {
        email: data.email,
        phone: data.phone,
        shipping_full_name: data.fullName,
        shipping_address_1: data.address1,
        shipping_address_2: data.address2 || '',
        shipping_city: data.city,
        shipping_department: data.department,
        shipping_postal_code: data.postalCode || '',
        delivery_instructions: data.deliveryInstructions || '',
        billing_name: data.billingName || data.fullName,
        billing_nit: data.billingNit || 'CF',
        items: items.map(item => ({
          product_id: item.productId,
          variant_id: item.variantId,
          quantity: item.quantity,
        })),
      }
      
      // Simular creación de orden
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockOrderNumber = `HM${new Date().getFullYear()}${Date.now().toString().slice(-6).toUpperCase()}`
      
      // 2. Procesar pago según método seleccionado
      if (data.paymentMethod === 'card') {
        // Procesar con Pagalo
        const [firstName, ...lastNameParts] = data.fullName.split(' ')
        const lastName = lastNameParts.join(' ') || firstName
        
        const paymentData: CardPaymentData = {
          order_number: mockOrderNumber,
          first_name: firstName,
          last_name: lastName,
          phone: data.phone,
          email: data.email,
          city: data.city,
          department: data.department,
          address: data.address1,
          card_name: data.cardName || '',
          card_number: data.cardNumber?.replace(/\s/g, '') || '',
          expiration_month: data.cardExpMonth || '',
          expiration_year: data.cardExpYear || '',
          cvv: data.cardCvv || '',
          currency: 'GTQ',
          billing_nit: data.billingNit,
          billing_name: data.billingName,
        }
        
        // Simular procesamiento de pago
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // En producción:
        // const paymentResult = await paymentService.processCardPayment(paymentData)
        // if (!paymentResult.data.success) throw new Error(paymentResult.data.error)
      } else if (data.paymentMethod === 'transfer') {
        // Pago por transferencia - pendiente de verificación
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      // Para pago en efectivo, no se requiere procesamiento adicional
      
      // Éxito
      setOrderNumber(mockOrderNumber)
      toast.success('¡Pedido creado exitosamente!')
      clearCart()
      setStep(3)
      
    } catch (error: any) {
      console.error('Error processing order:', error)
      toast.error(error.message || 'Error al procesar el pedido. Intenta de nuevo.')
    } finally {
      setIsProcessing(false)
    }
  }
  
  // Formatear número de tarjeta con espacios
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : value
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
  
  // Componente para mostrar errores de campo
  const FieldError = ({ error }: { error?: string }) => {
    if (!error) return null
    return (
      <motion.p 
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 text-sm mt-1 flex items-center"
      >
        <FiAlertCircle className="w-4 h-4 mr-1" />
        {error}
      </motion.p>
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
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                step > index + 1 ? 'bg-hahnemann-500 text-white' :
                step === index + 1 ? 'bg-hahnemann-500 text-white ring-4 ring-hahnemann-100' : 
                'bg-gray-200 text-gray-500'
              }`}>
                {step > index + 1 ? <FiCheck className="w-5 h-5" /> : index + 1}
              </div>
              <span className={`ml-2 hidden sm:inline font-medium ${step >= index + 1 ? 'text-charcoal' : 'text-gray-400'}`}>
                {label}
              </span>
              {index < 2 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 transition-colors ${step > index + 1 ? 'bg-hahnemann-500' : 'bg-gray-200'}`} />
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
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-hahnemann-400 to-hahnemann-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FiCheck className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold text-charcoal mb-4">
              ¡Pedido Confirmado!
            </h2>
            <p className="text-gray-600 mb-4">
              Gracias por tu compra. Te hemos enviado un email con los detalles de tu pedido.
            </p>
            <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
              <p className="text-gray-500 text-sm mb-2">Número de orden</p>
              <p className="text-2xl font-bold text-hahnemann-600">
                #{orderNumber}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="btn btn-primary">
                Seguir Comprando
              </Link>
              <Link href="/perfil" className="btn btn-outline">
                Ver Mis Pedidos
              </Link>
            </div>
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
                      <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-hahnemann-100 text-hahnemann-600 flex items-center justify-center mr-3 text-sm font-bold">1</span>
                        Información de Contacto
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="label">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            {...register('email')}
                            type="email"
                            className={`input ${errors.email ? 'border-red-500 focus:ring-red-200' : ''}`}
                            placeholder="tu@email.com"
                          />
                          <FieldError error={errors.email?.message} />
                        </div>
                        <div>
                          <label className="label">
                            Teléfono <span className="text-red-500">*</span>
                          </label>
                          <input
                            {...register('phone')}
                            type="tel"
                            className={`input ${errors.phone ? 'border-red-500 focus:ring-red-200' : ''}`}
                            placeholder="+502 1234-5678"
                          />
                          <FieldError error={errors.phone?.message} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Shipping Info */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-hahnemann-100 text-hahnemann-600 flex items-center justify-center mr-3 text-sm font-bold">2</span>
                        Dirección de Envío
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="label">
                            Nombre Completo <span className="text-red-500">*</span>
                          </label>
                          <input
                            {...register('fullName')}
                            className={`input ${errors.fullName ? 'border-red-500 focus:ring-red-200' : ''}`}
                            placeholder="Juan Pérez García"
                          />
                          <FieldError error={errors.fullName?.message} />
                        </div>
                        
                        <div>
                          <label className="label">
                            Dirección <span className="text-red-500">*</span>
                          </label>
                          <input
                            {...register('address1')}
                            className={`input ${errors.address1 ? 'border-red-500 focus:ring-red-200' : ''}`}
                            placeholder="Calle, número, zona (ej: 12 Calle 1-25, Zona 10)"
                          />
                          <FieldError error={errors.address1?.message} />
                        </div>
                        
                        <div>
                          <label className="label">Dirección Línea 2 (Opcional)</label>
                          <input
                            {...register('address2')}
                            className="input"
                            placeholder="Edificio, apartamento, oficina, etc."
                          />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="label">
                              Departamento <span className="text-red-500">*</span>
                            </label>
                            <select 
                              {...register('department')} 
                              className={`input ${errors.department ? 'border-red-500 focus:ring-red-200' : ''}`}
                            >
                              <option value="">Seleccionar departamento...</option>
                              {departments.map((dep) => (
                                <option key={dep} value={dep}>{dep}</option>
                              ))}
                            </select>
                            <FieldError error={errors.department?.message} />
                          </div>
                          
                          <div>
                            <label className="label">
                              Municipio <span className="text-red-500">*</span>
                            </label>
                            <select 
                              {...register('city')} 
                              className={`input ${errors.city ? 'border-red-500 focus:ring-red-200' : ''}`}
                              disabled={!selectedDepartment}
                            >
                              <option value="">
                                {selectedDepartment ? 'Seleccionar municipio...' : 'Primero selecciona departamento'}
                              </option>
                              {municipalities.map((mun) => (
                                <option key={mun} value={mun}>{mun}</option>
                              ))}
                            </select>
                            <FieldError error={errors.city?.message} />
                          </div>
                        </div>
                        
                        <div>
                          <label className="label">Instrucciones de Entrega (Opcional)</label>
                          <textarea
                            {...register('deliveryInstructions')}
                            className="input min-h-[80px]"
                            placeholder="Ej: Dejar con el guardia, tocar timbre blanco, edificio color azul..."
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Billing Info */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-hahnemann-100 text-hahnemann-600 flex items-center justify-center mr-3 text-sm font-bold">3</span>
                        Datos de Facturación (Opcional)
                      </h3>
                      <div className="p-3 bg-blue-50 rounded-xl mb-4 flex items-start gap-2">
                        <FiInfo className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-700">
                          Si no ingresas NIT, tu factura será emitida a Consumidor Final (CF)
                        </p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="label">Nombre para Factura</label>
                          <input
                            {...register('billingName')}
                            className="input"
                            placeholder="Nombre o razón social"
                          />
                        </div>
                        <div>
                          <label className="label">NIT</label>
                          <input
                            {...register('billingNit')}
                            className={`input ${errors.billingNit ? 'border-red-500 focus:ring-red-200' : ''}`}
                            placeholder="12345678 o CF"
                          />
                          <FieldError error={errors.billingNit?.message} />
                        </div>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleContinueToPayment}
                      className="btn btn-primary w-full py-4 text-lg"
                    >
                      Continuar al Pago
                      <FiCreditCard className="ml-2" />
                    </button>
                  </motion.div>
                )}
                
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    {/* Payment Method Selection */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center">
                        <FiCreditCard className="mr-2 text-hahnemann-500" />
                        Método de Pago
                      </h3>
                      
                      <div className="space-y-3">
                        <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === 'card' 
                            ? 'border-hahnemann-500 bg-hahnemann-50' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}>
                          <input 
                            type="radio" 
                            {...register('paymentMethod')}
                            value="card"
                            className="mr-3" 
                          />
                          <span className="flex-1">
                            <span className="font-medium text-charcoal">Tarjeta de Crédito/Débito</span>
                            <span className="block text-sm text-gray-500">Visa, Mastercard, American Express</span>
                          </span>
                          <div className="flex gap-1">
                            <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                            <div className="w-10 h-6 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                          </div>
                        </label>
                        
                        <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === 'cash' 
                            ? 'border-hahnemann-500 bg-hahnemann-50' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}>
                          <input 
                            type="radio" 
                            {...register('paymentMethod')}
                            value="cash"
                            className="mr-3" 
                          />
                          <span className="flex-1">
                            <span className="font-medium text-charcoal">Efectivo contra Entrega</span>
                            <span className="block text-sm text-gray-500">Paga al recibir tu pedido</span>
                          </span>
                          <FiDollarSign className="w-6 h-6 text-green-500" />
                        </label>
                        
                        <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === 'transfer' 
                            ? 'border-hahnemann-500 bg-hahnemann-50' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}>
                          <input 
                            type="radio" 
                            {...register('paymentMethod')}
                            value="transfer"
                            className="mr-3" 
                          />
                          <span className="flex-1">
                            <span className="font-medium text-charcoal">Transferencia Bancaria</span>
                            <span className="block text-sm text-gray-500">Depósito o transferencia (verificación manual)</span>
                          </span>
                        </label>
                      </div>
                    </div>
                    
                    {/* Card Details (only show if card payment selected) */}
                    {paymentMethod === 'card' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white rounded-2xl p-6 shadow-sm"
                      >
                        <h3 className="text-lg font-semibold text-charcoal mb-4">
                          Datos de la Tarjeta
                        </h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="label">
                              Nombre en la Tarjeta <span className="text-red-500">*</span>
                            </label>
                            <input
                              {...register('cardName')}
                              className={`input ${errors.cardName ? 'border-red-500 focus:ring-red-200' : ''}`}
                              placeholder="Como aparece en la tarjeta"
                            />
                            <FieldError error={errors.cardName?.message} />
                          </div>
                          
                          <div>
                            <label className="label">
                              Número de Tarjeta <span className="text-red-500">*</span>
                            </label>
                            <Controller
                              name="cardNumber"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  className={`input font-mono ${errors.cardNumber ? 'border-red-500 focus:ring-red-200' : ''}`}
                                  placeholder="1234 5678 9012 3456"
                                  maxLength={19}
                                  onChange={(e) => {
                                    const formatted = formatCardNumber(e.target.value)
                                    field.onChange(formatted)
                                  }}
                                />
                              )}
                            />
                            <FieldError error={errors.cardNumber?.message} />
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="label">
                                Mes <span className="text-red-500">*</span>
                              </label>
                              <select
                                {...register('cardExpMonth')}
                                className={`input ${errors.cardExpMonth ? 'border-red-500 focus:ring-red-200' : ''}`}
                              >
                                <option value="">MM</option>
                                {months.map((m) => (
                                  <option key={m.value} value={m.value}>{m.value}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="label">
                                Año <span className="text-red-500">*</span>
                              </label>
                              <select
                                {...register('cardExpYear')}
                                className={`input ${errors.cardExpYear ? 'border-red-500 focus:ring-red-200' : ''}`}
                              >
                                <option value="">AA</option>
                                {years.map((y) => (
                                  <option key={y.value} value={y.value}>{y.label}</option>
                                ))}
                              </select>
                              <FieldError error={errors.cardExpMonth?.message} />
                            </div>
                            
                            <div>
                              <label className="label">
                                CVV <span className="text-red-500">*</span>
                              </label>
                              <input
                                {...register('cardCvv')}
                                type="password"
                                maxLength={4}
                                className={`input text-center font-mono ${errors.cardCvv ? 'border-red-500 focus:ring-red-200' : ''}`}
                                placeholder="123"
                              />
                              <FieldError error={errors.cardCvv?.message} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Bank Transfer Info */}
                    {paymentMethod === 'transfer' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-blue-50 rounded-2xl p-6"
                      >
                        <h4 className="font-semibold text-blue-800 mb-3">Datos para Transferencia</h4>
                        <div className="space-y-2 text-sm text-blue-700">
                          <p><strong>Banco:</strong> Banco Industrial</p>
                          <p><strong>Cuenta:</strong> 123-456789-0</p>
                          <p><strong>Nombre:</strong> Hahnemann Guatemala S.A.</p>
                          <p className="pt-2 border-t border-blue-200 mt-3">
                            Envía el comprobante a: <strong>pagos@hahnemann.gt</strong>
                          </p>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Security Note */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 flex items-center">
                        <FiLock className="mr-2 text-hahnemann-500 flex-shrink-0" />
                        Tus datos están protegidos con encriptación SSL de 256 bits
                      </p>
                    </div>
                    
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="btn btn-outline flex-1"
                      >
                        <FiArrowLeft className="mr-2" />
                        Volver
                      </button>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="btn btn-primary flex-1 py-4"
                      >
                        {isProcessing ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Procesando...
                          </div>
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
                
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <Image 
                            src={item.image} 
                            alt={item.name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-2xl">📦</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-charcoal line-clamp-2 text-sm">{item.name}</p>
                        <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                        <p className="font-semibold text-hahnemann-600">Q{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <hr className="my-4" />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({items.length} productos)</span>
                    <span className="font-medium">Q{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío</span>
                    <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                      {shipping === 0 ? '¡Gratis!' : `Q${shipping.toFixed(2)}`}
                    </span>
                  </div>
                </div>
                
                <hr className="my-4" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-hahnemann-600">Q{total.toFixed(2)}</span>
                </div>
                
                {subtotal < 500 && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-xl">
                    <p className="text-sm text-yellow-800">
                      🎁 Agrega <strong>Q{(500 - subtotal).toFixed(2)}</strong> más para envío gratis
                    </p>
                  </div>
                )}
                
                {subtotal >= 500 && (
                  <div className="mt-4 p-3 bg-green-50 rounded-xl">
                    <p className="text-sm text-green-800 flex items-center">
                      <FiCheck className="mr-2" />
                      ¡Tienes envío gratis!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

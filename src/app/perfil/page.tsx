'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiPackage, FiHeart,
  FiSettings, FiLogOut, FiEdit2, FiPlus, FiTrash2, FiCheck,
  FiLock, FiCalendar, FiChevronRight, FiShoppingBag
} from 'react-icons/fi'
import { useAuthStore, Address } from '@/store/authStore'
import { userService } from '@/lib/api'
import { getDepartmentNames, getMunicipalitiesByDepartment } from '@/data/guatemala'
import toast from 'react-hot-toast'

// Schemas de validación
const profileSchema = z.object({
  firstName: z.string().min(2, 'Mínimo 2 caracteres'),
  lastName: z.string().min(2, 'Mínimo 2 caracteres'),
  phone: z.string().min(8, 'Teléfono inválido').optional().or(z.literal('')),
  dateOfBirth: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Mínimo 6 caracteres'),
  newPassword: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string().min(8, 'Mínimo 8 caracteres'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

const addressSchema = z.object({
  fullName: z.string().min(3, 'Nombre requerido'),
  phone: z.string().min(8, 'Teléfono inválido'),
  addressLine1: z.string().min(5, 'Dirección requerida'),
  addressLine2: z.string().optional(),
  department: z.string().min(1, 'Departamento requerido'),
  city: z.string().min(1, 'Municipio requerido'),
  postalCode: z.string().optional(),
  deliveryInstructions: z.string().optional(),
  isDefault: z.boolean().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>
type AddressFormData = z.infer<typeof addressSchema>

type TabType = 'profile' | 'orders' | 'addresses' | 'wishlist' | 'security'

// Mock data para desarrollo
const mockOrders = [
  { id: 'HM2024ABC123', date: '2024-12-28', status: 'delivered', total: 450.00, items: 3 },
  { id: 'HM2024DEF456', date: '2024-12-25', status: 'shipped', total: 280.50, items: 2 },
  { id: 'HM2024GHI789', date: '2024-12-20', status: 'processing', total: 125.00, items: 1 },
]

const mockAddresses: Address[] = [
  {
    id: 1,
    addressType: 'both',
    fullName: 'Juan Pérez',
    phone: '+502 5555-1234',
    addressLine1: '12 Calle 1-25, Zona 10',
    addressLine2: 'Edificio Geminis, Oficina 401',
    city: 'Guatemala',
    department: 'Guatemala',
    postalCode: '01010',
    isDefault: true,
  },
  {
    id: 2,
    addressType: 'shipping',
    fullName: 'Juan Pérez',
    phone: '+502 5555-5678',
    addressLine1: 'Avenida Las Américas 7-62',
    city: 'Antigua Guatemala',
    department: 'Sacatepéquez',
    isDefault: false,
  },
]

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, logout, updateUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState<TabType>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState('')
  
  const departments = getDepartmentNames()
  const municipalities = getMunicipalitiesByDepartment(selectedDepartment)

  // Si no está autenticado, mostrar pantalla de login
  useEffect(() => {
    // Para desarrollo, simular usuario si no está autenticado
    if (!isAuthenticated) {
      updateUser({
        id: 1,
        email: 'usuario@ejemplo.com',
        username: 'usuario',
        firstName: 'Juan',
        lastName: 'Pérez',
        phone: '+502 5555-1234',
        acceptsMarketing: true,
        totalOrders: 5,
        totalSpent: 1250.50,
        createdAt: '2024-01-15',
      } as any)
    }
  }, [isAuthenticated, updateUser])

  // Profile Form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
    }
  })

  // Password Form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  // Address Form
  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  })

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
      })
    }
  }, [user, profileForm])

  const handleProfileSubmit = async (data: ProfileFormData) => {
    try {
      // await userService.updateProfile(data)
      updateUser(data as any)
      toast.success('Perfil actualizado correctamente')
      setIsEditing(false)
    } catch {
      toast.error('Error al actualizar perfil')
    }
  }

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    try {
      // await userService.changePassword(data.currentPassword, data.newPassword)
      toast.success('Contraseña actualizada correctamente')
      passwordForm.reset()
    } catch {
      toast.error('Error al cambiar contraseña')
    }
  }

  const handleAddressSubmit = async (data: AddressFormData) => {
    try {
      if (editingAddress) {
        // Update
        setAddresses(addresses.map(a => 
          a.id === editingAddress.id ? { ...a, ...data } : a
        ))
        toast.success('Dirección actualizada')
      } else {
        // Create
        const newAddress: Address = {
          id: Date.now(),
          addressType: 'both',
          ...data,
          isDefault: data.isDefault || false,
        }
        setAddresses([...addresses, newAddress])
        toast.success('Dirección agregada')
      }
      setShowAddressModal(false)
      setEditingAddress(null)
      addressForm.reset()
    } catch {
      toast.error('Error al guardar dirección')
    }
  }

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter(a => a.id !== id))
    toast.success('Dirección eliminada')
  }

  const openEditAddress = (address: Address) => {
    setEditingAddress(address)
    setSelectedDepartment(address.department)
    addressForm.reset({
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      department: address.department,
      city: address.city,
      postalCode: address.postalCode || '',
      deliveryInstructions: address.deliveryInstructions || '',
      isDefault: address.isDefault,
    })
    setShowAddressModal(true)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
    toast.success('Sesión cerrada')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700'
      case 'shipped': return 'bg-blue-100 text-blue-700'
      case 'processing': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Entregado'
      case 'shipped': return 'Enviado'
      case 'processing': return 'En proceso'
      default: return status
    }
  }

  const tabs = [
    { id: 'profile' as TabType, label: 'Mi Perfil', icon: FiUser },
    { id: 'orders' as TabType, label: 'Mis Pedidos', icon: FiPackage },
    { id: 'addresses' as TabType, label: 'Direcciones', icon: FiMapPin },
    { id: 'wishlist' as TabType, label: 'Favoritos', icon: FiHeart },
    { id: 'security' as TabType, label: 'Seguridad', icon: FiLock },
  ]

  return (
    <div className="min-h-screen bg-cream pt-24 pb-12">
      <div className="container-custom">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-24">
              {/* User Info Header */}
              <div className="bg-gradient-to-br from-hahnemann-500 to-hahnemann-600 p-6 text-white">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-3xl font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-center">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-hahnemann-200 text-sm text-center mt-1">
                  {user?.email}
                </p>
                <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-white/20">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{user?.totalOrders || 0}</p>
                    <p className="text-xs text-hahnemann-200">Pedidos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">Q{(user?.totalSpent || 0).toFixed(0)}</p>
                    <p className="text-xs text-hahnemann-200">Gastado</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id 
                        ? 'bg-hahnemann-50 text-hahnemann-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                    {activeTab === tab.id && (
                      <FiChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                ))}
                
                <hr className="my-4" />
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span className="font-medium">Cerrar Sesión</span>
                </button>
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-6 md:p-8 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-display font-bold text-charcoal">
                      Información Personal
                    </h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="btn btn-outline btn-sm"
                    >
                      <FiEdit2 className="mr-2" />
                      {isEditing ? 'Cancelar' : 'Editar'}
                    </button>
                  </div>

                  <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre
                        </label>
                        <input
                          {...profileForm.register('firstName')}
                          disabled={!isEditing}
                          className="input disabled:bg-gray-50 disabled:text-gray-500"
                        />
                        {profileForm.formState.errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">
                            {profileForm.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Apellido
                        </label>
                        <input
                          {...profileForm.register('lastName')}
                          disabled={!isEditing}
                          className="input disabled:bg-gray-50 disabled:text-gray-500"
                        />
                        {profileForm.formState.errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">
                            {profileForm.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FiMail className="inline mr-2" />
                          Email
                        </label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="input bg-gray-50 text-gray-500"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          El email no se puede cambiar
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FiPhone className="inline mr-2" />
                          Teléfono
                        </label>
                        <input
                          {...profileForm.register('phone')}
                          disabled={!isEditing}
                          className="input disabled:bg-gray-50 disabled:text-gray-500"
                          placeholder="+502 1234-5678"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FiCalendar className="inline mr-2" />
                          Fecha de Nacimiento
                        </label>
                        <input
                          {...profileForm.register('dateOfBirth')}
                          type="date"
                          disabled={!isEditing}
                          className="input disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="mt-6 flex justify-end">
                        <button type="submit" className="btn btn-primary">
                          <FiCheck className="mr-2" />
                          Guardar Cambios
                        </button>
                      </div>
                    )}
                  </form>
                </motion.div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-display font-bold text-charcoal mb-6">
                    Mis Pedidos
                  </h2>
                  
                  {mockOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                      <FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-charcoal mb-2">
                        No tienes pedidos aún
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Explora nuestros productos y haz tu primera compra
                      </p>
                      <a href="/" className="btn btn-primary">
                        Ir a la Tienda
                      </a>
                    </div>
                  ) : (
                    mockOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-charcoal">
                              Pedido #{order.id}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.date).toLocaleDateString('es-GT', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                          
                          <div className="text-right">
                            <p className="font-bold text-hahnemann-600">
                              Q{order.total.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.items} producto{order.items > 1 ? 's' : ''}
                            </p>
                          </div>
                          
                          <button className="btn btn-outline btn-sm">
                            Ver Detalles
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-display font-bold text-charcoal">
                      Mis Direcciones
                    </h2>
                    <button
                      onClick={() => {
                        setEditingAddress(null)
                        addressForm.reset()
                        setSelectedDepartment('')
                        setShowAddressModal(true)
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      <FiPlus className="mr-2" />
                      Agregar Dirección
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`bg-white rounded-2xl p-6 shadow-sm border-2 ${
                          address.isDefault ? 'border-hahnemann-500' : 'border-transparent'
                        }`}
                      >
                        {address.isDefault && (
                          <span className="inline-block px-2 py-1 bg-hahnemann-100 text-hahnemann-700 text-xs font-medium rounded-full mb-3">
                            Principal
                          </span>
                        )}
                        <h3 className="font-semibold text-charcoal mb-1">
                          {address.fullName}
                        </h3>
                        <p className="text-gray-600 text-sm mb-1">
                          {address.addressLine1}
                        </p>
                        {address.addressLine2 && (
                          <p className="text-gray-600 text-sm mb-1">
                            {address.addressLine2}
                          </p>
                        )}
                        <p className="text-gray-600 text-sm mb-1">
                          {address.city}, {address.department}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {address.phone}
                        </p>
                        
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => openEditAddress(address)}
                            className="text-hahnemann-600 hover:text-hahnemann-700 text-sm font-medium"
                          >
                            <FiEdit2 className="inline mr-1" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium ml-4"
                          >
                            <FiTrash2 className="inline mr-1" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <motion.div
                  key="wishlist"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-12 shadow-sm text-center"
                >
                  <FiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-charcoal mb-2">
                    Tu lista de favoritos está vacía
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Guarda tus productos favoritos para encontrarlos fácilmente
                  </p>
                  <a href="/" className="btn btn-primary">
                    Explorar Productos
                  </a>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-6 md:p-8 shadow-sm"
                >
                  <h2 className="text-2xl font-display font-bold text-charcoal mb-6">
                    Cambiar Contraseña
                  </h2>

                  <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="max-w-md">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contraseña Actual
                        </label>
                        <input
                          {...passwordForm.register('currentPassword')}
                          type="password"
                          className="input"
                        />
                        {passwordForm.formState.errors.currentPassword && (
                          <p className="text-red-500 text-sm mt-1">
                            {passwordForm.formState.errors.currentPassword.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nueva Contraseña
                        </label>
                        <input
                          {...passwordForm.register('newPassword')}
                          type="password"
                          className="input"
                        />
                        {passwordForm.formState.errors.newPassword && (
                          <p className="text-red-500 text-sm mt-1">
                            {passwordForm.formState.errors.newPassword.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirmar Nueva Contraseña
                        </label>
                        <input
                          {...passwordForm.register('confirmPassword')}
                          type="password"
                          className="input"
                        />
                        {passwordForm.formState.errors.confirmPassword && (
                          <p className="text-red-500 text-sm mt-1">
                            {passwordForm.formState.errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary mt-6">
                      <FiLock className="mr-2" />
                      Actualizar Contraseña
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddressModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-display font-bold text-charcoal mb-6">
                {editingAddress ? 'Editar Dirección' : 'Nueva Dirección'}
              </h3>

              <form onSubmit={addressForm.handleSubmit(handleAddressSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    {...addressForm.register('fullName')}
                    className="input"
                    placeholder="Juan Pérez"
                  />
                  {addressForm.formState.errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {addressForm.formState.errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    {...addressForm.register('phone')}
                    className="input"
                    placeholder="+502 1234-5678"
                  />
                  {addressForm.formState.errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {addressForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <input
                    {...addressForm.register('addressLine1')}
                    className="input"
                    placeholder="Calle, número, zona"
                  />
                  {addressForm.formState.errors.addressLine1 && (
                    <p className="text-red-500 text-sm mt-1">
                      {addressForm.formState.errors.addressLine1.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección Línea 2
                  </label>
                  <input
                    {...addressForm.register('addressLine2')}
                    className="input"
                    placeholder="Edificio, oficina, etc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departamento *
                    </label>
                    <select
                      {...addressForm.register('department')}
                      onChange={(e) => {
                        addressForm.setValue('department', e.target.value)
                        addressForm.setValue('city', '')
                        setSelectedDepartment(e.target.value)
                      }}
                      className="input"
                    >
                      <option value="">Seleccionar...</option>
                      {departments.map((dep) => (
                        <option key={dep} value={dep}>{dep}</option>
                      ))}
                    </select>
                    {addressForm.formState.errors.department && (
                      <p className="text-red-500 text-sm mt-1">
                        {addressForm.formState.errors.department.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Municipio *
                    </label>
                    <select
                      {...addressForm.register('city')}
                      className="input"
                      disabled={!selectedDepartment}
                    >
                      <option value="">Seleccionar...</option>
                      {municipalities.map((mun) => (
                        <option key={mun} value={mun}>{mun}</option>
                      ))}
                    </select>
                    {addressForm.formState.errors.city && (
                      <p className="text-red-500 text-sm mt-1">
                        {addressForm.formState.errors.city.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instrucciones de Entrega
                  </label>
                  <textarea
                    {...addressForm.register('deliveryInstructions')}
                    className="input min-h-[80px]"
                    placeholder="Dejar con guardia, tocar timbre, etc."
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    {...addressForm.register('isDefault')}
                    type="checkbox"
                    className="w-4 h-4 text-hahnemann-600 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Establecer como dirección principal
                  </span>
                </label>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="btn btn-outline flex-1"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary flex-1">
                    {editingAddress ? 'Guardar Cambios' : 'Agregar Dirección'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

